const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const config = require('../config');
const Message = require('../models/Messages');
const Dialog = require('../models/Dialog');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPathMessageFile);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

const router = express.Router();

const updateReadStatus = (req, res, userId, dialogId) => {
    Message.updateMany(
        { dialog: dialogId, user: { $ne: userId } },
        { $set: { read: true } },
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: err,
                });
            }
            req.io.emit('SERVER:MESSAGES_READ', {
                userId,
                dialogId,
            });
        },
    );
};

router.get('/', auth, async (req, res) => {
    const dialogId = req.query.dialog;
    const userId = req.user._id;

    updateReadStatus(req, res, userId, dialogId);

    try {
        const messages = await Message.find({dialog: dialogId}).populate('dialog').populate('user', '_id fullName');

        res.send(messages);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', auth, upload.single('attachments'), async (req, res) => {
    const userId = req.user._id;

    const messageData = {
        dialog: req.body.dialog,
        text: req.body.text,
        attachments: req.body.attachments,
        user: userId
    };

    if (req.file) {
        messageData.attachments = req.file.filename;
    }

    const message = new Message (messageData);

    updateReadStatus(req, res, userId, req.body.dialog._id);

    message.save()
        .then(results => {
            results.populate(['dialog', 'user'], (err, message) => {
                if (err) {
                  return res.status(500).send({
                    status: 'error',
                    message: err,
                  });
                }
                Dialog.findOneAndUpdate(
                  { _id: messageData.dialog },
                  { lastMessage: message._id },
                  { upsert: true },
                  function(err) {
                    if (err) {
                      return res.status(500).send({
                        status: 'error',
                        message: err,
                      });
                    }
                  },
                );
                res.send(message);
      
                req.io.emit('SERVER:NEW_MESSAGE', message);
              });
            })
        .catch(error => {
            res.status(400).send(error)
        });
});

module.exports = router;
