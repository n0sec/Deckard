const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { lfgChannel, hcLfgChannel } = require('../channels.json');
const lfgSchema = require('../schemas/lfgSchema');
const memberSchema = require('../schemas/memberSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lfg')
        .setDescription('Creates a post with information for grouping up with others.')
        .addIntegerOption(option => option.setName('level').setDescription('The level of the host').setRequired(true))
        .addStringOption(option => option
            .setName('difficulty')
            .setDescription('The difficulty you are playing in. Choices are Normal, Nightmare and Hell')
            .setRequired(true)
            .addChoice('Normal', 'Normal')
            .addChoice('Nightmare', 'Nightmare')
            .addChoice('Hell', 'Hell'))
        .addStringOption(option => option.setName('objective').setDescription('What the party will be mostly doing while grouped up').setRequired(true))
        .addStringOption(option => option
            .setName('ladder')
            .setDescription('Ladder or Non-Ladder')
            .setRequired(true)
            .addChoice('Ladder', 'Ladder')
            .addChoice('Non-Ladder', 'Non-Ladder')),
    description: `Creates a looking for group listing for forming a party with others.
    
**Options:**
- **difficulty:** The difficulty you are playing in. Choices are Normal, Nightmare and Hell
- **objective:** What the party will be mostly doing while grouped up
- **ladder:** Is your listing for ladder or non-ladder? Choices are Ladder and Non-Ladder`,
    // .addStringOption(option => option.setName('members').setDescription('The existing members in your party').setRequired(false)),
    async execute(interaction) {
        const host = interaction.user.id;
        const querySc = {
            "user_id": interaction.user.id,
            "channel_id": lfgChannel
        }

        const queryHc = {
            "user_id": interaction.user.id,
            "channel_id": hcLfgChannel
        }

        // Find any document from the sc-lfg channel or hc-lfg channel
        const lfgDbDocument = await lfgSchema.findOne().or([querySc, queryHc]);
        const memberDocument = await memberSchema.findOne({ id: host });

        // If lfgDbDocument isn't null or undefined
        // Someone has posted before and we should handle it below
        if (lfgDbDocument !== null && lfgDbDocument !== undefined) {
            await interaction.channel.messages.fetch(lfgDbDocument.message_id)
                // Delete before telling the user
                .then(async msg => {
                    console.log(`Command issued twice for ${interaction.user.tag}. Deleting old message and threads...`);
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
            // const members = interaction.options.getString('members');

            // Split the items by comma
            // const membersArray = members?.trim().split(','); // Array

            // if (membersArray?.length === 3) {
            //     await interaction.reply({ content: 'There\'s no need to make a listing if you already have a full party. Pick an open game channel.', ephemeral: true });
            //     return;
            // }

            if (level > 99) {
                await interaction.reply({ content: 'Level must be 99 or less.', ephemeral: true });
                return;
            }

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
                        .setCustomId('deleteButton')
                        .setLabel('Delete')
                        .setStyle('DANGER')
                );

            const lfgEmbed = new MessageEmbed()
                .setColor('#002fa6')
                .setTitle(`LFG - OPEN`)
                .setAuthor('❤️ Deckard')
                .setDescription(`<@${interaction.member.id}> is looking for a party! Click the green button to join!`)
                .addField('Level', `${level}`, true)
                .addField('Difficulty', `${difficulty}`, true)
                .addField('Objective', `${objective}`, true)
                .addField('Ladder', `${ladder}`, true)
                .addField('Party Members', `<@${host}> - **${memberDocument?.switch_code ?? "N/A"}**`, true)
                .setTimestamp()

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
                        user_tag: interaction.user.tag,
                        channel_id: reply.channelId,
                        // If the 'members' Option is not specified (i.e. null), return just the user who initiated the command as the only party member
                        partyMembers: host,
                        partyCount: 1
                    }
                    await new lfgSchema(storedMessage).save();

                    console.log(`LFG detected from ${interaction.user.username}. Creating thread...`);

                    const thread = await reply.startThread({
                        name: `${interaction.user.username} Party`,
                        autoArchiveDuration: 60,
                        reason: 'Party thread',
                    });

                    await thread.members.add(host);

                } catch (err) {
                    console.error(err);
                }
            }).catch(err => { console.error(err) });

        }
    },
}