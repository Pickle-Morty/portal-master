const express = require('express');
const auth = require('../../middleware/auth');
// const updateLastSeen = require('../../middleware/updateLastSeen');
const permit = require('../../middleware/permit');
const nanoid = require("nanoid");
const User = require('../../models/User');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({}, {
            email: true,
            firstName: true,
            secondName: true,
            lastName: true,
            fullName: true,
            role: true,
            appointSubjects: true,
            last_seen: true}).populate('appointSubjects').sort('secondName').sort('firstName');

        return res.send(users)
    } catch (e) {
        return res.status(500).send(e)
    }
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).populate('user', 'id fullName').populate('appointSubjects');
        res.send(user);
    } catch (e) {
        if (e.name === 'ValidationError') {
            return res.status(400).send(e)
        }
        return res.status(500).send(e)
    }
});

router.post('/', [auth, permit('admin')], async (req, res) => {
    const userData = {
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        lastName: req.body.lastName,
        fullName: `${req.body.secondName} ${req.body.firstName} ${req.body.lastName}`,
        token: nanoid(),
    };

    const user = new User (userData);

    user.save()
        .then(results => res.send(results))
        .catch(error => {
            res.status(400).send(error)
        } );
});

router.patch('/role_change/:id', [auth, permit('admin')], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        user.role = req.body.role;

        await user.save();

        res.sendStatus(200)

    } catch (e) {
        return res.status(500).send(e)
    }
});

router.patch('/:id', [auth, permit('admin')], async (req, res) => {
    const singleUser = await User.findByIdAndUpdate({_id: req.params.id}, {$push: {appointSubjects: req.body.appointSubjects}});

    singleUser.save()
        .then(result => res.send(result))
        .catch(error => res.status(400).send(error));
});

module.exports = router;