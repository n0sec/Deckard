const { reactionRolesChannel } = require("../channels.json");
const { guildId } = require("../config.json")

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user, client) {
        // Set the Class-Based roles by finding them by name
        const sinRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Assassin");
        const zonRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Amazon");
        const barbRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Barbarian");
        const druidRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Druid");
        const necroRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Necromancer");
        const pallyRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Paladin");
        const sorcRole = client.guilds.cache.get(guildId).roles.cache.find(role => role.name === "Sorceress");

        // Get the emoji IDs from Discord
        // \:emoji_name:
        const sinEmoji = '892211955236999219';
        const zonEmoji = '892208767893110856';
        const barbEmoji = '892211955459313724';
        const druidEmoji = '892211955140546641';
        const necroEmoji = '892211955442515998';
        const pallyEmoji = '892211954993733653';
        const sorcEmoji = '892211955597713468';

        if (user.bot) return;

        if (reaction.message.partial) {
            await reaction.message.fetch();
        }

        // Remove roles if the reaction has been de-selected
        if (reaction.message.channel.id === reactionRolesChannel && !user.bot) {
            switch (reaction.emoji.id) {
                // Character classes
                case sinEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(sinRole);
                    break;
                case zonEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(zonRole);
                    break;
                case barbEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(barbRole);
                    break;
                case druidEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(druidRole);
                    break;
                case necroEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(necroRole);
                    break;
                case pallyEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(pallyRole);
                    break;
                case sorcEmoji:
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(sorcRole);
                    break;
            }
        }
    },
}