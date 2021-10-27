const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const lfgSchema = mongoose.Schema({
    message_id: reqString,
    user_id: reqString,
    tag: reqString,
    channel_id: reqString,
    partyMembers: [String],
    partyCount: {
        type: Number,
        max: 4
    }
});

module.exports = mongoose.model('lfgposts', lfgSchema);