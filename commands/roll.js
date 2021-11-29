const { SlashCommandBuilder } = require('@discordjs/builders');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a d20! Useful for rolling for loot!'),
	async execute(interaction) {
		await interaction.reply(`<@${interaction.member.id}> rolled a ${getRandomInt(1, 21)}`);
	},
};