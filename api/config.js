const path = require('path');

const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPathNotice: path.join(rootPath, 'public/uploads/notice'),
    uploadPathSubject: path.join(rootPath, 'public/uploads/subject'),
    uploadPathMessageFile: path.join(rootPath, 'public/uploads/messageFile'),
    dbUrl: 'mongodb://localhost/portal',
    mongoOption: { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false},
};
