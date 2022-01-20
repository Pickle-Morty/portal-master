const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoticeSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Поле обязательно для заполнения']
    },
    description: String,
    noticeFile: [String],
    dateTime: String
});

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;