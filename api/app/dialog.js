const express = require('express');
const auth = require('../middleware/auth');
const Dialog = require('../models/Dialog');
const Message = require('../models/Messages');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const userId = req.user._id;
    Dialog.find()
    .or([{ author: userId }, { partner: userId }])
    .populate(['author', 'partner'])
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'user',
      },
    })
    .exec(function(err, dialogs) {
      if (err) {
        return res.status(404).send({
          message: 'Dialogs not found',
        });
      }
      return res.json(dialogs);
    });
});

router.post('/', auth, async (req, res) => {
    const dialogData = {
        author: req.user._id,
        partner: req.body.partner
    };

    Dialog.findOne(
        {
          author: req.user._id,
          partner: req.body.partner,
        },
        (err, user) => {
          if (err) {
            return res.status(500).send({
              status: 'error',
              message: err,
            });
          }
          if (user) {
            return res.status(403).send({
              status: 'error',
              message: 'Такой диалог уже есть',
            });
          } else {
            const dialog = new Dialog(dialogData);
  
            dialog
              .save()
              .then((dialogObj) => {
                const message = new Message({
                  text: req.body.text,
                  user: req.user._id,
                  dialog: dialogObj._id,
                });
  
                message
                  .save()
                  .then(() => {
                    dialogObj.lastMessage = message._id;
                    dialogObj.save().then(() => {
                      res.send(dialogObj);
                      req.io.emit('SERVER:DIALOG_CREATED', {
                        ...dialogData,
                        dialog: dialogObj,
                      });
                    });
                  })
                  .catch(reason => {
                    res.send(reason);
                  });
              })
              .catch(err => {
                res.send({
                  status: 'error',
                  message: err,
                });
              });
          }
        },
      );
});

module.exports = router;