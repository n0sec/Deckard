const { SlashCommandBuilder } = require('@discordjs/builders');
const memberSchema = require('../schemas/memberSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findcode')
        .setDescription('Searches the database for the mentioned user')
        .addMentionableOption(option => option.setName('user').setDescription('User to search for!').setRequired(true)),
    async execute(interaction) {
        try {
            const mentionedUserId = interaction.options.getMentionable('user').id;
            const foundUser = await memberSchema.findOne({ id: mentionedUserId }).lean();
            if (foundUser) {
                await interaction.reply(`<@${mentionedUserId}>'s Switch Code is **${foundUser.switch_code}**, their Profile Name is **${foundUser.switch_name}** and their Timezone is **${foundUser.timezone ?? "N/A"}**.`)
            } else {
                await interaction.reply(`<@${mentionedUserId}> is not in the database yet. Use **/addcode** to add your Switch Code.`)
            }
        } catch (err) {
            console.error(err);
            interaction.reply(`An error occurred when processing the command. Please check the command and try again.`);
        }
    }
};