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

            const lfgListing = await lfgSchema.findOne({ message_id: messageInteractedWith });

            if (interaction.customId === 'deleteButton' && userWhoClickedButton === userWhoSentCommand) {
                console.log(`DELETE detected from ${interaction.user.username}. Deleting message...`);
                try {
                    // If the message has a thread already or a thread is already archived on the message
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

                if (lfgListing.partyCount === 4) {
                    await interaction.reply({ content: 'This party is full! Please join another or make your own using **/lfg**.', ephemeral: true });
                    return;
                }

                if (lfgListing.partyMembers.includes(userWhoClickedButton)) {
                    await interaction.reply({ content: 'You have already joined this party.', ephemeral: true });
                    return;
                }
                console.log(`JOIN detected from ${interaction.user.username} on ${userWhoSentCommandUsername} LFG. Editing Message...`);
                try {
                    const partyMember = await memberSchema.findOne({ id: userWhoClickedButton });

                    const receivedEmbed = interaction.message.embeds[0];
                    let partyMembersValue = receivedEmbed.fields[4];
                    partyMembersValue.value += `\n<@${userWhoClickedButton}> - **${partyMember?.switch_code ?? "N/A"}**`;

                    const editedEmbed = new MessageEmbed(receivedEmbed);

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
                        await interaction.message.components[0].components[2].setDisabled();

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
                console.log(`END detected from ${interaction.user.username}. Creating thread...`);
                try {
                    const existingLfgDocument = await lfgSchema.findOne({ message_id: messageInteractedWith });
                    const existingParty = existingLfgDocument.partyMembers; // Array

                    // Receive the embed
                    const receivedEmbed = interaction.message.embeds[0];

                    // Create a new Embed Object with the received one as a template/starting point
                    const editedEmbed = new MessageEmbed(receivedEmbed);

                    // Disable the End button
                    await interaction.message.components[0].components[2].setDisabled();

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
                } catch (err) {
                    console.error(err);
                }

            } else if (interaction.customId === 'leaveButton' && lfgListing.partyMembers.includes(userWhoClickedButton)) {
                const receivedEmbed = interaction.message.embeds[0];
                let partyMembersValue = receivedEmbed.fields[4];

                const regex = new RegExp(`\\n?<@!?${userWhoClickedButton}>.*\\n?`);

                console.log(`LEAVE detected from ${interaction.user.username} on ${userWhoSentCommandUsername} LFG. Editing Message...`);

                if (interaction.message.hasThread) {
                    try {

                        // Remove user from thread
                        await interaction.message.thread.members.remove(userWhoClickedButton);

                        // Remove user from Embed
                        partyMembersValue.value = partyMembersValue.value.replace(regex, '');

                        // If the JOIN button is disabled, re-enable it for further joining
                        if (interaction.message.components[0].components[0].disabled) {
                            await interaction.message.components[0].components[0].setDisabled(false);
                        }

                        if (partyMembersValue.value === '') {
                            await interaction.reply({ content: 'You cannot leave if you are the last member. If you initiated the command, please delete the message instead using the Delete button.', ephemeral: true });
                        }

                        const editedEmbed = new MessageEmbed(receivedEmbed);

                        if (lfgListing.partyCount < 4) {
                            editedEmbed.setTitle('LFG - OPEN');
                        }

                        // Remove user from database and decrement partyCount
                        await lfgSchema.updateOne({ message_id: messageInteractedWith }, { $pull: { partyMembers: userWhoClickedButton }, $inc: { partyCount: -1 } });

                        await interaction.message.edit({ embeds: [editedEmbed], components: [interaction.message.components[0]] });

                        await interaction.reply({ content: 'You have successfully left the party!', ephemeral: true });
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    try {
                        // Remove user from Embed
                        partyMembersValue.value = partyMembersValue.value.replace(regex, '');

                        // If the JOIN button is disabled, re-enable it for further joining
                        if (interaction.message.components[0].components[0].disabled) {
                            await interaction.message.components[0].components[0].setDisabled(false);
                        }

                        // If there's only one user left and they try to leave
                        // This has to be here or else Discord complains about empty string fields
                        if (partyMembersValue.value === '') {
                            await interaction.reply({ content: 'You cannot leave if you are the last member. If you initiated the command, please delete the message instead using the Delete button.', ephemeral: true });
                        }

                        const editedEmbed = new MessageEmbed(receivedEmbed);

                        if (lfgListing.partyCount < 4) {
                            editedEmbed.setTitle('LFG - OPEN');
                        }

                        // Remove user from database and decrement partyCount
                        await lfgSchema.updateOne({ message_id: messageInteractedWith }, { $pull: { partyMembers: userWhoClickedButton }, $inc: { partyCount: -1 } });

                        await interaction.message.edit({ embeds: [editedEmbed], components: [interaction.message.components[0]] });

                        await interaction.reply({ content: 'You have successfully left the party!', ephemeral: true });
                    } catch (err) {
                        console.error(err);
                    }
                }
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