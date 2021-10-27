const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const memberSchema = mongoose.Schema({
    id: reqString,
    tag: reqString,
    switch_code: {
        type: String,
        validate: /(SW)-(\d{4})-(\d{4})-(\d{4})/,
        required: true
    },
    switch_name: reqString,
    timezone: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('members', memberSchema);