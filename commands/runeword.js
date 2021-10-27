const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('runeword')
        .setDescription('Shows the stats for runewords')
        .addSubcommand(subcommand =>
            subcommand
                .setName('body-armor')
                .setDescription('Body Armor Runewords')
                .addStringOption(option => option.setName('item').setDescription('The Runeword to get information on').setRequired(true)
                    .addChoice('Bone', 'Bone')
                    .addChoice('Bramble', 'Bramble')
                    .addChoice('Chains of Honor', 'Chains of Honor')
                    .addChoice('Dragon', 'Dragon')
                    .addChoice('Duress', 'Duress')
                    .addChoice('Enigma', 'Enigma')
                    .addChoice('Fortitude', 'Fortitude')
                    .addChoice('Gloom', 'Gloom')
                    .addChoice('Lionheart', 'Lionheart')
                    .addChoice('Myth', 'Myth')
                    .addChoice('Peace', 'Peace')
                    .addChoice('Principle', 'Principle')
                    .addChoice('Prudence', 'Prudence')
                    .addChoice('Rain', 'Rain')
                    .addChoice('Smoke', 'Smoke')
                    .addChoice('Stealth', 'Stealth')
                    .addChoice('Stone', 'Stone')
                    .addChoice('Treachery', 'Treachery')
                    .addChoice('Wealth', 'Enlightenment')))
        .addSubcommand(subcommand =>
            subcommand.setName('head-armor')
                .setDescription('Head Armor Runewords')
                .addStringOption(option => option.setName('item').setDescription('The Runeword to get information on').setRequired(true)
                    .addChoice('Delirium', 'Delirium')
                    .addChoice('Dream', 'Dream')
                    .addChoice('Lore', 'Lore')
                    .addChoice('Nadir', 'Nadir')
                    .addChoice('Radiance', 'Radiance')))
        .addSubcommand(subcommand =>
            subcommand.setName('shields')
                .setDescription('Shield Runewords')
                .addStringOption(option => option.setName('item').setDescription('The Runeword to get information on').setRequired(true)
                    .addChoice('Ancient\'s Pledge', 'Ancient\'s Pledge')
                    .addChoice('Dragon', 'Dragon')
                    .addChoice('Exile', 'Exile')
                    .addChoice('Phoenix', 'Phoenix')
                    .addChoice('Rhyme', 'Rhyme')
                    .addChoice('Sanctuary', 'Sanctuary')
                    .addChoice('Spirit', 'Spirit')
                    .addChoice('Splendor', 'Splendor')))
        .addSubcommand(subcommand =>
            subcommand.setName('weapons1')
                .setDescription('Weapon Runewords (A-I)')
                .addStringOption(option => option.setName('item').setDescription('The Runeword to get information on').setRequired(true)
                    .addChoice('Beast', 'Beast')
                    .addChoice('Black', 'Black')
                    .addChoice('Brand', 'Brand')
                    .addChoice('Breath of the Dying', 'Breath of the Dying')
                    .addChoice('Call to Arms', 'Call to Arms')
                    .addChoice('Chaos', 'Chaos')
                    .addChoice('Crescent Moon', 'Crescent Moon')
                    .addChoice('Death', 'Death')
                    .addChoice('Destruction', 'Destruction')
                    .addChoice('Doom', 'Doom')
                    .addChoice('Edge', 'Edge')
                    .addChoice('Eternity', 'Eternity')
                    .addChoice('Faith', 'Faith')
                    .addChoice('Famine', 'Famine')
                    .addChoice('Fortitude', 'Fortitude')
                    .addChoice('Fury', 'Fury')
                    .addChoice('Grief', 'Grief')
                    .addChoice('Hand of Justice', 'Hand of Justice')
                    .addChoice('Harmony', 'Harmony')
                    .addChoice('Heart of the Oak', 'Heart of the Oak')
                    .addChoice('Holy Thunder', 'Holy Thunder')
                    .addChoice('Honor', 'Honor')
                    .addChoice('Ice', 'Ice')
                    .addChoice('Infinity', 'Infinity')
                    .addChoice('Insight', 'Insight')))
        // Set 2
        .addSubcommand(subcommand =>
            subcommand.setName('weapons2')
                .setDescription('Weapon Runewords (K-Z)')
                .addStringOption(option => option.setName('item').setDescription('The Runeword to get information on').setRequired(true)
                    .addChoice('King\'s Grace', 'King\'s Grace')
                    .addChoice('Kingslayer', 'Kingslayer')
                    .addChoice('Last Wish', 'Last Wish')
                    .addChoice('Lawbringer', 'Lawbringer')
                    .addChoice('Leaf', 'Leaf')
                    .addChoice('Malice', 'Malice')
                    .addChoice('Melody', 'Melody')
                    .addChoice('Memory', 'Memory')
                    .addChoice('Oath', 'Oath')
                    .addChoice('Obedience', 'Obedience')
                    .addChoice('Passion', 'Passion')
                    .addChoice('Phoenix', 'Phoenix')
                    .addChoice('Pride', 'Pride')
                    .addChoice('Rift', 'Rift')
                    .addChoice('Silence', 'Silence')
                    .addChoice('Spirit', 'Spirit')
                    .addChoice('Steel', 'Steel')
                    .addChoice('Strength', 'Strength')
                    .addChoice('Venom', 'Venom')
                    .addChoice('Voice of Reason', 'Voice of Reason')
                    .addChoice('White', 'White')
                    .addChoice('Wind', 'Wind')
                    .addChoice('Wrath', 'Wrath')
                    .addChoice('Zephyr', 'Zephyr'))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const option = interaction.options.getString('item').replace("'", "").replaceAll(" ", "_").toLowerCase();

        const runewordImage = `./images/runewords/${subcommand}/${option}.png`

        if (option === 'heart_of_the_oak') {
            await interaction.reply({ content: '**The only Mace class weapon that works with this Runeword is a Flail.**', files: [runewordImage], ephemeral: true });

        } else {
            await interaction.reply({ files: [runewordImage], ephemeral: true });
        }

    },
};