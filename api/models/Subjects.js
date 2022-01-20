const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubjectSchema = new Schema ({
    subject: {
        type: String,
        required: [true, 'Поле обязательно для заполнения']
    },
    materials: {
        type: [String],
        default: []
    },
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;