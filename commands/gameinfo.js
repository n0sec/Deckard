const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gameinfo')
        .setDescription('Assorted Game Information/Definitions')
        .addSubcommand(subcommand =>
            subcommand
                .setName('mf')
                .setDescription('Magic Find information'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('crushingblow')
                .setDescription('Information about Crushing Blow'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('openwounds')
                .setDescription('Information about Open Wounds'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ar')
                .setDescription('Information about Attack Rating')),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'mf':
                interaction.reply({ content: 'While the standard answer is "you can never have enough Magic Find", the real answer is more complicated. With diminishing returns, insanely high MF numbers are unlikely to get a lot more Unique items than someone with a more modest and efficient number. Since the key to good MF farming is getting as many kills in as short a time as possible, hampering your ability to speed-run is counterproductive. Many MF farmers find that around 400% MF is enough to give them a good chance of finding Uniques without losing too much speed. At 500%, nearly every gear item is at least Magic quality.', files: ['./images/mf.jpg'], ephemeral: true })
                break;
            case 'crushingblow':
                interaction.reply({
                    content: `Crushing Blow is a combat mechanic that appears as a Chance on Hit mod on several items. The game will roll for the chance for Crushing Blow to ocurr on every eligible melee or ranged attack. If the effect does occur, it reduces the attack's target health by a measured percentage. 

Crushing Blow reduces the current remaining Life of the target by 1/4 for melee attacks and 1/8 for ranged attacks on common Enemies. This varies according to the target.
On player or Hirelings, melee attacks deal 1/10 and ranged attacks deal 1/20
On Champion, Unique or Bosses, melee attacks deal 1/8 and ranged attacks deal 1/16.
                
Crushing Blow is most effective when the target is at high life, and becomes less and less useful as the target's health starts to decrease. It is imporatnt to note that, Crushing Blow is not limited to a maximum of 50% health reduction in Hell difficulty. 
                
Crushing Blow is less effective when there are more players in the game. For example if there are four players the monster's health is multiplied by 4, but the melee attack will only remove 1/16 of the health. 
                
It is possible to get up to 100% chance for a Crushing Blow. You get one chance on each swing, and your chances from your individual items are added together.
                
Amplify Damage and Decrepify do not affect Crushing Blow, beyond reducing the Enemies physical resistance to zero.`, ephemeral: true
                })
                break;
            case 'openwounds':
                interaction.reply({
                    content: `Open Wounds is a combat mechanic that appears as a Chance on Hit mod on several items. The game will roll for the chance for Open Wounds to ocurr on every eligible melee or ranged attack. If the effect does occur, it causes the monster to bleed, causing them to lose health for 8 seconds. Item modifiers for Open Wounds tend to stack, unless a character is wielding two Weapons. The chances do not corss betweeen them.

The amount of health the monster loses is scaled with the player's level. It does about 800 damage over 8 seconds at level 50. If Open Wounds is triggered by a ranged attack, the bleed damage is divided by 2.
If it is targeted  on a player, the bleed damage is divided by 4 for a melee attack and by 8 for a ranged attack.
If it is targeted on Unique or Bosses, the bleed damage is divided by 2 for melee attacks and by 4 for a ranged attack.
                
Once Open Wounds has been inflicted upon an Enemy, said monster can't regenerate health while the effect of Open Wounds is active.`, ephemeral: true
                })
                break;
            case 'ar':
                interaction.reply({
                    content: `Attack rating can be found on the Character Screen and it shows the percentage chance that you will hit the targeted monster. You can increase your attack rating by increasing your Dexterity or by equipping magic items that provide bonuses to it.
                
The chance to hit formula is as follows:

**Chance To Hit = 200% * {Attacker's Attack Rating / (Attacker's Attack Rating + Defender's Defense Rating)} * {Attacker's level / (Attacker's level + Defender's level)}**`, ephemeral: true
                })
                break;
        }
    }
};
