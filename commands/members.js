const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription('Returns the number of members in the server'),
    async execute(interaction) {
        await interaction.reply(`The server has **${interaction.guild.memberCount}** members`);
    }
};