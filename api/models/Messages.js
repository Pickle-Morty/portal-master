const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessagesSchema = new Schema ({
    dialog: {
        type: Schema.Types.ObjectID,
        ref: 'Dialog',
        required: true
    },
    user: {
        type: Schema.Types.ObjectID,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    attachments: {type: String},
}, {
    timestamps: true,
});

const Messages = mongoose.model('Message', MessagesSchema);

module.exports = Messages;
