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
        // tradeChannel is #bot-testing when dev
        if (message.channel.name.endsWith('trading') || message.channel.id === tradeChannel) {

            // Get a count of the messages that the person speaking has sent in the current channel
            // This should exclude anything from the opposite channel
            // For example, if a user sends something in sc-trading, this should not get any records from hc-trading
            const tradeChannelMessageCount = await tradeSchema.count({ user_id: messageAuthor, channel_id: messageChannelId });

            // If this is the 3rd message, then delete the oldest message and document and send a message that the user can try again
            // tradeChannelMessageCount is indexed by 0
            // count = 1 - 2nd post
            // count = 2 - 3rd post
            if (tradeChannelMessageCount > 1) {

                // Find the oldest document from the author
                const authorOldestTradeListing = await tradeSchema.find({ user_id: messageAuthor }).sort({ date_listed: 1 }).limit(1);

                // Delete the oldest document from the database
                await tradeSchema.deleteOne({ authorOldestTradeListing });

                // Save the message the user just sent to the db
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

                // Delete the oldest message from the chat
                message.channel.messages.fetch(authorOldestTradeListing[0].message_id)
                    .then(msg => msg.delete())
                    .catch(console.error);

                // Let the user know they had too many listings and they can try again
                // await message.author.send(`Hello! You recently made a trade listing that was over the limit of 2 per trade channel. I have included the post in this message so you can resend.\n\n${message.content}`)
            } else {
                // If the message starts with the "tag" 'WTS' or 'WTB' then begin listening
                if (message.content.toLowerCase().startsWith('wts') || message.content.toLowerCase().startsWith('wtb')) {
                    const lineCount = message.content.split('\n').length;

                    if (lineCount > 15) {
                        const longMessageContent = message.content;
                        message.delete()
                        await message.author.send(`Hello! You recently made a trade listing that was ${lineCount} lines. The limit is 15. I have included the post in this message so you can revise and resend.\n\n${longMessageContent}`)
                    } else {
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

                    }

                    // If the message doesn't start with the correct tag then delete it
                } else {
                    message.delete()
                    await message.author.send(`Hello! This DM is to let you know your message in <#${message.channel.id}> has been deleted. Please limit posts in this channel to trade listings only. If you were trying to send a trade listing, make sure it starts with "WTS" or "WTB"`)
                    // await message.channel.send('Oops! Your message has been deleted. Please limit posts in this channel to trade listings only. If you were trying to send a trade listing, make sure it starts with "WTS" or "WTB".')
                    //     .then(msg => {
                    //         setTimeout(() => {
                    //             if (!msg.deleted) {
                    //                 msg.delete()
                    //             }
                    //         }, 7000)
                    //     })
                }
            }
        }
    }
};

// 