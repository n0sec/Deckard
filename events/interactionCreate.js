const lfgSchema = require('../schemas/lfgSchema');
const memberSchema = require('../schemas/memberSchema');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        if (interaction.isButton()) {
            // Message ID that was reacted to
            // Use this to search the db
            const messageInteractedWith = interaction.message.id;
            const userWhoClickedButton = interaction.user.id;
            const userWhoSentCommand = interaction.message.interaction.user.id;
            const userWhoSentCommandUsername = interaction.message.interaction.user.username;



            if (interaction.customId === 'deleteButton' && userWhoClickedButton === userWhoSentCommand) {
                console.log('DELETE detected. Deleting message...');
                try {
                    if (interaction.message.hasThread) {
                        await interaction.message.thread.delete();
                    }
                    await interaction.message.delete()
                        .then(() => console.log(`Successfully deleted message!`))
                        .catch(console.error);
                    await lfgSchema.deleteOne({ message_id: messageInteractedWith });
                } catch (err) {
                    console.error(err);
                }
                // Did the user click the JOIN Button and were they NOT the person who issued the command?
            } else if (interaction.customId === 'joinButton' && userWhoClickedButton !== userWhoSentCommand) {
                const lfgDbDocument = await lfgSchema.findOne({ message_id: messageInteractedWith });

                if (lfgDbDocument.partyCount === 4) {
                    interaction.reply({ content: 'This party is full! Please join another or make your own using **/lfg**.', ephemeral: true });
                    return;
                }

                if (lfgDbDocument.partyMembers.includes(userWhoClickedButton)) {
                    interaction.reply({ content: 'You have already joined this party.', ephemeral: true });
                    return;
                }
                console.log('JOIN detected. Editing Message...');
                try {
                    const partyMember = await memberSchema.findOne({ id: userWhoClickedButton });

                    const receivedEmbed = interaction.message.embeds[0];
                    let partyMembersValue = receivedEmbed.fields[4];
                    partyMembersValue.value += `\n<@${userWhoClickedButton}> - **${partyMember?.switch_code ? partyMember.switch_code : "N/A"}**`;

                    const editedEmbed = new MessageEmbed(receivedEmbed)

                    await interaction.message.edit({ embeds: [editedEmbed] });
                    await interaction.reply({ content: 'You have successfully joined the party!', ephemeral: true });

                    const updatedLfgDocument = await lfgSchema.findOneAndUpdate({ message_id: messageInteractedWith }, {
                        $push: { partyMembers: userWhoClickedButton },
                        $inc: { partyCount: 1 }
                    }, { returnOriginal: false });

                    // If the message has a thread already, the LFG was ended early
                    // Add anyone that joins 
                    if (interaction.message.hasThread && interaction.message.thread.name === `${userWhoSentCommandUsername} Party`) {
                        // Add the user who clicked the button to the existing thread
                        await interaction.message.thread.members.add(userWhoClickedButton);
                    }

                    if (updatedLfgDocument.partyCount === 4) {
                        // Change the Embed title to indicate it's full
                        editedEmbed.setTitle('LFG - FULL');

                        // Set the JOIN and EDIT button to disabled
                        await interaction.message.components[0].components[0].setDisabled();
                        await interaction.message.components[0].components[1].setDisabled();

                        // Edit the Embed and send the new components
                        await interaction.message.edit({ embeds: [editedEmbed], components: [interaction.message.components[0]] });

                        if (interaction.message.hasThread) {
                            return;
                        } else {
                            // Create a thread
                            const thread = await interaction.message.startThread({
                                name: `${userWhoSentCommandUsername} Party`,
                                autoArchiveDuration: 60,
                                reason: 'Party thread',
                            });

                            // Loop through the Document and add each member to the thread
                            await updatedLfgDocument.partyMembers.forEach(member => thread.members.add(member));
                            await thread.send('The party is now full. Please use this thread for your game chat or one of the open game chats. This thread will auto-archive after 60 minutes of inactivity.')
                        }
                    }

                    console.log("Done!");
                } catch (err) {
                    console.error(err);
                }
            } else if (interaction.customId === 'endButton' && userWhoClickedButton === userWhoSentCommand) {
                const existingLfgDocument = await lfgSchema.findOne({ message_id: messageInteractedWith });
                const existingParty = existingLfgDocument.partyMembers; // Array

                // Receive the embed
                const receivedEmbed = interaction.message.embeds[0];

                // Create a new Embed Object with the received one as a template/starting point
                const editedEmbed = new MessageEmbed(receivedEmbed)

                // Disable the Edit button
                await interaction.message.components[0].components[1].setDisabled();

                // Resend the new, edited Embed
                await interaction.message.edit({ embeds: [editedEmbed], components: [interaction.message.components[0]] });

                // Start a thread
                const thread = await interaction.message.startThread({
                    name: `${userWhoSentCommandUsername} Party`,
                    autoArchiveDuration: 60,
                    reason: 'Party thread',
                });

                // Whoever is in the existing party when the End button is clicked, add them to the thread
                await existingParty.forEach(member => thread.members.add(member));

                // Send a reply so it doesn't need to be deferred
                await interaction.reply({ content: 'You have ended the LFG early. Members can still join and will be added to the thread that has been created for you.', ephemeral: true });

            } else {
                // If the user does something they aren't supposed to, send a generic reply
                interaction.reply({ content: 'You are not allowed to do that.', ephemeral: true })
            }
        }

        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};