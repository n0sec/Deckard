const { SlashCommandBuilder } = require('@discordjs/builders');
const memberWarningSchema = require('../schemas/memberWarningSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns the user for the specified reasonn')
        .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the warning').setRequired(true)),

    async execute(interaction) {
        const warnedUser = interaction.options.getUser('user');
        const warnedUserId = interaction.options.getUser('user').id;
        const warnReason = interaction.options.getString('reason');
        // If the user has the Horadrim or Zealot role
        if (interaction.member.roles.cache.has('891492181423046727') || interaction.member.roles.cache.has('898209133340291114')) {
            // 1. Check if the user id already exists in the database
            // This tells us if they have been warned already
            const warnedMemberCount = await memberWarningSchema.count({ id: warnedUserId });
            const warnedMemberDocument = await memberWarningSchema.findOne({ id: warnedUserId });
            // 1a. If they don't, create a new document and save it to the schema
            // 1a. Then put them in Timeout
            if (warnedMemberCount === 0) {
                try {
                    const warning = {
                        id: warnedUserId,
                        tag: interaction.options.getUser('user').tag,
                        warnings: {
                            issuingUser: interaction.user.tag,
                            reason: warnReason,
                            channel: interaction.channel.name,
                        },
                    }
                    // Save the document
                    await new memberWarningSchema(warning).save();
                    await interaction.reply(`User <@${warnedUserId}> has been warned for ${warnReason} and put in timeout for 5 minutes.`);
                    console.log('User put in Timeout');
                } catch (e) {
                    console.error(e);
                }
                // 1b. Check if they have 3 warnings already
            } else if (warnedMemberDocument.warnings.length >= 3) {
                console.log('User banned');
                // Ban the user for 7 days
                // TODO: Only undo this when we know it works
                // await interaction.member.ban({ days: 7, reason: `Final Warning For: ${warnReason}` })
                // TODO: Need to defer reply or reply

                // 1c. Otherwise, they exist and do not have 3 or more warnings and we should just update the document and put them in timeout
            } else {
                // Find the user and push the warning to the document for the user
                await memberWarningSchema.updateOne({ id: warnedUserId }, {
                    $push: {
                        warnings: {
                            issuingUser: interaction.user.tag,
                            reason: warnReason,
                            channel: interaction.channel.name
                        }
                    }
                });

                // Put the user in Timeout for 5 minutes
                // await warnedUser.timeout(5 * 60 * 1000, `Reason: ${warnReason}`);
                console.log('User put in Timeout');

                await interaction.reply(`User <@${warnedUserId}> has been warned for ${warnReason} and put in timeout for 5 minutes.`)
            }
            // 3c. Send a message to the channel that they have been warned (this shit should be public)
        } else {
            interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
    }
}