const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TestingSchema = new Schema ({
    subject: {
        type: String,
        required: [true, 'Поле обязательно для заполнения']
    },
    testingTitle: {
        type: String,
        required: [true, 'Поле обязательно для заполнения']
    },
});

const Testing = mongoose.model('Subject', TestingSchema);

module.exports = Testing;