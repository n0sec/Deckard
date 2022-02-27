const { reactionRolesChannel } = require("../channels.json");
const { guildId } = require("../config.json");
const { sinEmoji, zonEmoji, barbEmoji, druidEmoji, necroEmoji, pallyEmoji, sorcEmoji, softcoreEmoji, hardcoreEmoji, ladderEmoji, nonLadderEmoji } = require("../constants.json");


module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        if (user.bot) return;

        if (reaction.message.partial) {
            await reaction.message.fetch();
        }

        // Set the Class-Based roles by finding them by name
        const sinRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Assassin");
        const zonRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Amazon");
        const barbRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Barbarian");
        const druidRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Druid");
        const necroRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Necromancer");
        const pallyRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Paladin");
        const sorcRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Sorceress");

        const softcoreRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Softcore");
        const hardcoreRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Hardcore");

        const ladderRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Ladder");
        const nonLadderRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Non-Ladder");

        // TODO: Ladder and Non-Ladder Emoji are placeholders
        // Emoji: RoleID
        const roleEmojis = {
            sinEmoji: '892213019038318672',
            zonEmoji: '892212833213894706',
            barbEmoji: '892213393547743283',
            druidEmoji: '892213151330865182',
            necroEmoji: '892213250928828426',
            pallyEmoji: '892213339181170800',
            sorcEmoji: '892212545270714368',
            softcoreEmoji: '918522027416113173',
            hardcoreEmoji: '918522081728163891',
            ladderEmoji: '918522120957468712',
            nonLadderEmoji: '918522153622712390'
        }

        if (reaction.message.channel.id === reactionRolesChannel && !user.bot) {
            // if (user.roles.cache.has(roleEmojis[emoji_id])) {
            //     console.log(`User ${user.tag} already had selected role. Skipping...`);
            //     return;
            // }
            switch (reaction.emoji.id) {
                // Character classes
                case sinEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(sinRole);
                    break;
                case zonEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(zonRole);
                    break;
                case barbEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(barbRole);
                    break;
                case druidEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(druidRole);
                    break;
                case necroEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(necroRole);
                    break;
                case pallyEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(pallyRole);
                    break;
                case sorcEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(sorcRole);
                    break;
                case softcoreEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(softcoreRole);
                    break;
                case hardcoreEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(hardcoreRole);
                    break;
                case ladderEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(ladderRole);
                    break;
                case nonLadderEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.add(nonLadderRole);
                    break;
            }
        }
    },
}
