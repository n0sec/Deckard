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
	description: "Rolls a d20 dice. Use this to roll for loot if using non-FFA loot rules in your games",
	async execute(interaction) {
		await interaction.reply(`<@${interaction.member.id}> rolled a ${getRandomInt(1, 21)}`);
	},
};