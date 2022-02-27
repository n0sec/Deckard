const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const memberWarningSchema = mongoose.Schema({
    id: reqString,
    tag: reqString,
    warnings: [{
        issuingUser: String,
        reason: String,
        channel: String,
    }],
});

module.exports = mongoose.model('memberWarnings', memberWarningSchema);