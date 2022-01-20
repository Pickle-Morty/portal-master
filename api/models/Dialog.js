const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DialogSchema = new Schema ({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    partner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    }
}, {timestamps: true});

const Dialog = mongoose.model('Dialog', DialogSchema);

module.exports = Dialog;