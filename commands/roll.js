const { SlashCommandBuilder } = require('@discordjs/builders');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a d20! Useful for rolling for loot!'),
	async execute(interaction) {
		await interaction.reply(`<@${interaction.member.id}> rolled a ${getRandomInt(20)}`);
	},
};