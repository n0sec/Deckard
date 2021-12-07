const tradeSchema = require('../schemas/tradeSchema');
const { tradeChannel, hcTradeChannel } = require('../channels.json');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const messageAuthor = message.author.id;
        const messageAuthorTag = message.author.tag;
        const messageId = message.id;
        const messageChannelId = message.channel.id;

        // If the bot sends a message, don't do anything (duh)
        if (message.author.bot) {
            return;
        }

        // Only listen for messages in these channels
        if (message.channel.id === tradeChannel || message.channel.id === hcTradeChannel) {

            // Get a count of the messages that the person speaking has sent in the current channel
            // This should exclude anything from the opposite channel
            // For example, if a user sends something in sc-trading, this should not get any records from hc-trading
            const tradeChannelMessageCount = await tradeSchema.count({ user_id: messageAuthor, channel_id: messageChannelId });

            // If this is the 3rd message, then delete the oldest message and document and send a message that the user can try again
            if (tradeChannelMessageCount > 2) {

                // Find the oldest listing from the author
                const authorOldestTradeListing = await tradeSchema.find({ user_id: messageAuthor }).sort({ date_listed: 1 }).limit(1);

                // Delete the oldest message
                await message.channel.messages.delete(messageId);

                // Delete the document from the database
                await tradeSchema.deleteOne(authorOldestTradeListing);

                await message.channel.send({ content: 'You previously had 2 trade listings in this channel already. The oldest has been deleted and you can now try again.' });
            } else {
                // If the message starts with the "tag" 'WTS' or 'WTB' then begin listening
                if (message.content.startsWith('WTS').toLowerCase() || message.content.startsWith('WTB').toLowerCase()) {
                    try {
                        const tradeListing = {
                            message_id: messageId,
                            user_id: messageAuthor,
                            user_tag: messageAuthorTag,
                            trade_tag: message.content.slice(0, 3), // Obtain the trade tag using slice since it should be the first 3 letters
                            channel_id: messageChannelId,
                            date_listed: message.createdAt
                        }
                        await new tradeSchema(tradeListing).save();
                    } catch (err) {
                        console.error(err);
                    }

                    // If the message doesn't start with the correct tag then delete it
                } else {
                    message.delete()
                        .then(msg => msg.channel.send({ content: 'Oops! Your message has been deleted. Please limit posts in this channel to trade listings only. If you were trying to send a trade listing, make sure it starts with "WTS" or "WTB".', ephemeral: true }))
                        .catch(console.error);
                }
            }
        }
    }
};