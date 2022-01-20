const express = require('express');
const multer = require('multer');
const config = require('../config');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const Subject = require('../models/Subjects');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPathSubject);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const subject = await Subject.find().sort('subject');

        res.send(subject);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', [auth, permit('admin')], async (req, res) => {
    const subjectData = {
        subject: req.body.subject
    };

    const subject = new Subject (subjectData);

    subject.save()
        .then(results => res.send(results))
        .catch(error => {
            res.status(400).send(error)
        });
});

router.patch('/:id', [auth, permit('admin', 'teacher')], upload.array('materials', 5), async (req, res) => {
    const singleSubjectData = req.body;

    if (req.files) {
       singleSubjectData.materials = req.files.map(file => file.filename)
    }

    const singleSubject = await Subject.findByIdAndUpdate({_id: req.params.id}, {$push: {materials: {$each: singleSubjectData.materials}}});

    singleSubject.save()
        .then(result => res.send(result))
        .catch(error => res.status(400).send(error));
});

module.exports = router;
