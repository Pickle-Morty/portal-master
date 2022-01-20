const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionsSchema = new Schema ({
    testingTitle: {
        type: String,
        required: [true, 'Поле обязательно для заполнения']
    },
    question:{


    },
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;