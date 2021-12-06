const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const tradeSchema = mongoose.Schema({
    message_id: reqString,
    user_id: reqString,
    user_tag: reqString,
    trade_tag: {
        type: String,
        validate: /^(WTS|WTB)$/i,
        required: true
    },
    channel_id: reqString
});

module.exports = mongoose.model('tradeposts', tradeSchema);