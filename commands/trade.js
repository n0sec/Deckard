const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { tradeChannel, hcTradeChannel } = require('../channels.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('Post an item that you want to trade')
        .addSubcommand(subcommand =>
            subcommand
                .setName('wtt')
                .setDescription('Trading for items')
                .addStringOption(option => option.setName('trading').setDescription('The item(s) you have to trade. Separate multiple items with commas').setRequired(true))
                .addStringOption(option => option.setName('want').setDescription('The item(s) you want to trade for. "BO" is a valid choice. Separate multiple items with commas').setRequired(true))
                .addStringOption(option => option.setName('ladder').setDescription('Ladder or Non-Ladder').setRequired(true).addChoice('Ladder', 'Ladder').addChoice('Non-Ladder', 'Non-Ladder').setRequired(true))
                .addStringOption(option => option.setName('details').setDescription('Any additional details').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('lf')
                .setDescription('Looking for items')
                .addStringOption(option => option.setName('items').setDescription('The item(s) you want. Separate multiple items with commas').setRequired(true))
                .addStringOption(option => option.setName('ladder').setDescription('Ladder or Non-Ladder').setRequired(true).addChoice('Ladder', 'Ladder').addChoice('Non-Ladder', 'Non-Ladder'))
        ),
    async execute(interaction) {
        if (interaction.channel.id !== tradeChannel && interaction.channel.id !== hcTradeChannel) {
            interaction.reply({ content: `This command must be used in <#${tradeChannel}> or <#${hcTradeChannel}>. Deleting in 5 seconds.`, fetchReply: true })
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
        } else {
            // Ladder can be used for both subcommands
            const ladder = interaction.options.getString('ladder');

            /* TRADE WTT */
            if (interaction.options.getSubcommand() === "wtt") {
                // Set trading and want variables to the values of the options
                const trading = interaction.options.get('trading').value

                // Split the items by comma
                const tradingSplit = trading.trim().split(',');
                const tradingItems = tradingSplit.join('\n');

                const want = interaction.options.get('want').value
                const wantSplit = want.trim().split(',');
                const wantItems = wantSplit.join('\n');

                const details = interaction.options.getString('details')

                const tradeEmbed = new MessageEmbed()
                    .setColor('#fcba03')
                    .setTitle('Trading - WTT')
                    .setAuthor('❤️ Deckard')
                    .setDescription(`<@${interaction.member.id}> has items to trade!`)
                    .addField('Trading', `${tradingItems}`, true)
                    .addField('Want', `${wantItems}`, true)
                    .addField('Ladder/Non-Ladder', `${ladder}`)
                    .addField('Additional Details', `${details ? details : 'N/A'}`)
                    .setTimestamp()

                await interaction.reply({
                    embeds: [tradeEmbed],
                    fetchReply: true
                })
                /* TRADE LF */
            } else if (interaction.options.getSubcommand() === "lf") {
                const items = interaction.options.getString('items');

                const lfEmbed = new MessageEmbed()
                    .setColor('#00ebd3')
                    .setTitle('Trading - LF')
                    .setAuthor('❤️ Deckard')
                    .setDescription(`<@${interaction.member.id}> is looking for some items!`)
                    .addField('Looking For', `${items}`, true)
                    .addField('Ladder/Non-Ladder', `${ladder}`, true)
                    .setTimestamp()

                await interaction.reply({
                    embeds: [lfEmbed],
                    components: [row],
                    fetchReply: true
                })
            }
        }
    },
};


