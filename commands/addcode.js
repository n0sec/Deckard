const { SlashCommandBuilder } = require('@discordjs/builders');
const memberSchema = require('../schemas/memberSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcode')
        .setDescription('Adds your Switch friend code to the database!')
        .addStringOption(option => option.setName('code').setDescription('Your Switch Friend Code. SW-XXXX-XXXX-XXXX').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('Your Switch Profile Name').setRequired(true))
        .addStringOption(option => option.setName('timezone').setDescription('The timezone you are in/play most in').setRequired(false)),
    async execute(interaction) {
        try {
            const memberCode = {
                id: interaction.user.id,
                tag: interaction.user.tag,
                switch_code: interaction.options.getString('code'),
                switch_name: interaction.options.getString('name'),
                timezone: interaction.options.getString('timezone')
            }
            // Count the records for the person issuing the command
            // There should only be one record at a time
            const userCount = await memberSchema.count({ id: interaction.user.id });
            if (userCount === 0) { // User does not exist
                await new memberSchema(memberCode).save();
                interaction.reply(`<@${interaction.user.id}> added their Friend Code successfully!`);

            } else { // User exists and update the record with just the new switch code and timezone
                await memberSchema.findOneAndUpdate({ id: interaction.user.id }, { switch_code: memberCode.switch_code, timezone: memberCode.timezone }, { runValidators: true });
                interaction.reply(`<@${interaction.user.id}> already exists in the database. Updated record.`)
            }
        } catch (err) {
            console.error(err);
            interaction.reply({ content: `Oops! Something went wrong. The format is SW-XXXX-XXXX-XXXX. Check your format and try again.`, ephemeral: true });
        }
    }
};