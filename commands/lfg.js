const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { lfgChannel, hcLfgChannel } = require('../channels.json');
const lfgSchema = require('../schemas/lfgSchema');
const memberSchema = require('../schemas/memberSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lfg')
        .setDescription('Creates a post with information for grouping up with others.')
        .addIntegerOption(option => option.setName('level').setDescription('The level of the leader').setRequired(true))
        .addStringOption(option => option
            .setName('difficulty')
            .setDescription('Normal/Nightmare/Hell')
            .setRequired(true)
            .addChoice('Normal', 'Normal')
            .addChoice('Nightmare', 'Nightmare')
            .addChoice('Hell', 'Hell'))
        .addStringOption(option => option.setName('objective').setDescription('The objective of the party').setRequired(true))
        .addStringOption(option => option
            .setName('ladder')
            .setDescription('Ladder or Non-Ladder')
            .setRequired(true)
            .addChoice('Ladder', 'Ladder')
            .addChoice('Non-Ladder', 'Non-Ladder'))
        .addStringOption(option => option.setName('members').setDescription('The existing members in your party').setRequired(false)),
    async execute(interaction) {
        const querySc = {
            "user_id": interaction.user.id,
            "channel_id": lfgChannel
        }

        const queryHc = {
            "user_id": interaction.user.id,
            "channel_id": hcLfgChannel
        }
        // Find any document from the sc-lfg channel or hc-lfg channel
        const lfgDbDocument = await lfgSchema.findOne().or([querySc, queryHc]).lean();
        // If lfgDbDocument isn't null or undefined
        // Someone has posted before and we should handle it below
        if (lfgDbDocument !== null && lfgDbDocument !== undefined) {
            await interaction.channel.messages.fetch(lfgDbDocument.message_id)
                // Delete before telling the user
                .then(async msg => {
                    console.log('Command issued twice for same user. Deleting old message and threads...');
                    // Check if the message has a thread attached
                    if (msg.hasThread) {
                        await msg.thread.delete();
                    }
                    await msg.delete();
                    await lfgDbDocument.deleteOne({ message_id: lfgDbDocument.message_id });
                    console.log('Done');
                }).catch(err => { console.error(err) });
            interaction.reply({ content: `It looks like you already have an LFG post in <#${lfgChannel}> or <#${hcLfgChannel}>. I've gone ahead and deleted the existing message. You may use **/lfg** again.`, ephemeral: true });
        } else if (interaction.channel.id !== lfgChannel && interaction.channel.id !== hcLfgChannel) {
            interaction.reply({ content: `This command must be used in <#${lfgChannel}> or <#${hcLfgChannel}>.`, ephemeral: true });
        } else {
            const level = interaction.options.getInteger('level');
            const difficulty = interaction.options.getString('difficulty');
            const objective = interaction.options.getString('objective');
            const ladder = interaction.options.getString('ladder');
            const members = interaction.options.getString('members');

            // Split the items by comma
            const membersArray = members?.trim().split(','); // Array

            if (membersArray?.length === 3) {
                await interaction.reply({ content: 'There\'s no need to make a listing if you already have a full party. Pick an open game channel.', ephemeral: true })
            }

            const hostArray = [interaction.member.id];
            const partyMembersArray = membersArray ? hostArray.concat(membersArray) : hostArray; // Array1
            const partyMembersLength = partyMembersArray.length;

            const membersDbInfo = await memberSchema.find({ id: partyMembersArray }).lean(); // Array2

            for (partyMember of partyMembersArray) {
                if (!membersDbInfo.some(member => member.id === partyMember)) {
                    const nonExistingMember = {
                        id: partyMember,
                        switch_code: null
                    }
                    membersDbInfo.push(nonExistingMember);
                }
            }

            const membersMapArray = membersDbInfo.map(member => `<@${member.id}> - **${member?.switch_code ?? "N/A"}**`).join('\n');

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('joinButton')
                        .setLabel('Join')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('leaveButton')
                        .setLabel('Leave')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('endButton')
                        .setLabel('End')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('deleteButton')
                        .setLabel('Delete')
                        .setStyle('DANGER')
                );

            const lfgEmbed = new MessageEmbed()
                .setColor('#002fa6')
                .setTitle(`LFG`)
                .setAuthor('❤️ Deckard')
                .setDescription(`<@${interaction.member.id}> is looking for a party! Click the green button to join!`)
                .addField('Level', `${level}`, true)
                .addField('Difficulty', `${difficulty}`, true)
                .addField('Objective', `${objective}`, true)
                .addField('Ladder', `${ladder}`, true)
                .addField('Party Members', `${membersMapArray}`, true)

            await interaction.reply({
                embeds: [lfgEmbed],
                components: [row],
                fetchReply: true
            }).then(async (reply) => { // reply is now <Message>
                try {
                    // Store the message and user who initiated
                    const storedMessage = {
                        message_id: reply.id,
                        user_id: interaction.member.id,
                        tag: interaction.user.tag,
                        channel_id: reply.channelId,
                        // If the 'members' Option is not specified (i.e. null), return just the user who initiated the command as the only party member
                        partyMembers: partyMembersArray,
                        partyCount: partyMembersLength
                    }
                    await new lfgSchema(storedMessage).save();
                } catch (err) {
                    console.error(err);
                }
            }).catch(err => { console.error(err) });

        }
    },
}