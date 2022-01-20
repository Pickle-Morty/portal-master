const express = require('express');
const multer = require('multer');
const config = require('../config');
const auth = require('../middleware/auth');
const tryAuth = require('../middleware/tryAuth');
const permit = require('../middleware/permit');
const Notice = require('../models/Notice');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPathNotice);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', tryAuth, async (req, res) => {
    try {
        const notice = await Notice.find().populate('user', '_id firstName secondName').sort({dateTime: -1});

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const notices = {};

        if (endIndex < notice.length) {
            notices.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            notices.previous = {
                page: page - 1,
                limit: limit
            };
        }

        notices.notices = notice.slice(startIndex, endIndex);
        notices.totalNotices = notice.length;
        res.send(notices);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', [auth, permit('admin')], upload.array('noticeFile', 5), (req, res) => {
    const noticeData = {
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        noticeFile: [],
        dateTime: new Date().toISOString()
    };

    if (req.files) {
        noticeData.noticeFile = req.files.map(file => file.filename)
    }

    const notice = new Notice (noticeData);

    notice.save()
        .then(results => res.send(results))
        .catch(error => {
            res.status(400).send(error)
        } );
});

router.delete('/:id', [auth, permit('admin')], (req, res) => {
    Notice.deleteOne({_id: req.params.id})
        .then(result => res.send(result))
        .catch(error => res.status(403).send(error))
});

module.exports = router;