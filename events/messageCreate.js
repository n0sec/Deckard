const tradeSchema = require('../schemas/tradeSchema');
const { tradeChannel, hcTradeChannel } = require('../channels.json');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) {
            return;
        }

        // Only listen for messages in these channels
        if (message.channel.id === tradeChannel || message.channel.id === hcTradeChannel) {

            // If the message starts with the "tag" 'WTS' or 'WTB' then begin listening
            if (message.content.startsWith('WTS').toLowerCase() || message.content.startsWith('WTB').toLowerCase()) {
                try {
                    const tradeListing = {
                        message_id: message.id,
                        user_id: message.author.id,
                        user_tag: message.author.tag,
                        trade_tag: message.content.slice(0, 3),
                        channel_id: message.channel.id
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
};