const express = require('express');
const mongoose = require ('mongoose');
const config = require('./config');
const cors = require ('cors');
const {createServer} = require('http');

const users = require('./app/user');
const notice = require('./app/notice');
const adminUsers = require('./app/admin/users');
const subject = require('./app/subject');
const dialog = require('./app/dialog');
const message = require('./app/message');
const tryAuth = require('./middleware/tryAuth');
const updateLastSeen = require('./middleware/updateLastSeen');
const createSocket = require('./core/socket');

const app = express();
const http = createServer(app);
const io = createSocket(http);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(tryAuth);
app.use(updateLastSeen);
app.use(function(req, res, next) {
    req.io = io;
    next();
});

const port = 8001;

mongoose.connect(config.dbUrl, config.mongoOption).then(() => {
    http.listen(port, () => {
        app.use('/admin/users', adminUsers);
        app.use('/users', users);
        app.use('/notice', notice);
        app.use('/subject', subject);
        app.use('/dialog', dialog);
        //app.use('/test', test);
        app.use('/messages', message);
        console.log(`Server started on ${port} port`);
    });
});
