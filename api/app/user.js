const express = require('express');
const tryAuth = require('../middleware/tryAuth');
const User = require('../models/User');
const updateLastSeen = require('../middleware/updateLastSeen');

const router = express.Router();

router.get('/', tryAuth, async (req, res) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            return res.status(401).send({error: 'Authorization headers not present'});
        }

        const user = await User.findOne({token});

        if (!user) {
            return res.status(401).send({error: 'Неверный токен'});
        }

        res.send(user);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        lastName: req.body.lastName,
        fullName: `${req.body.secondName} ${req.body.firstName} ${req.body.last}`,
    });
    user.generateToken();

    try {
        await user.save();
        return res.send({message: 'Пользователь зарегистрирован', user});
    } catch (error) {
        return res.status(400).send(error)
    }
});

router.post('/sessions', updateLastSeen, async (req, res) => {
    const user = await User.findOneAndUpdate({email: req.body.email}, {$set: {last_seen: new Date()}}).populate('user');

    if (!user) {
        return res.status(400).send({error: 'Такого пользователя нет'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
        return res.status(400).send({error: 'Неверный email или пароль'});
    }

    user.generateToken();

    await user.save();

    res.send({message: 'Успешная авторизация', user});
});


router.delete('/sessions', async (req, res) => {
    const token = req.get('Authorization');
    const success = {message: 'Logged out'};

    if (!token) {
        return res.send(success);
    }
    const user = await User.findOne({token});

    if (!user) {
        return res.send(success);
    }

    user.generateToken();
    await user.save();

    return res.send(success);
});

router.put('/sessions', tryAuth, async (req, res) => {
    const token = req.get('Authorization');

    if (!token) {
        return res.status(401).send({error: 'Authorization headers not present'});
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'Неверный токен'});
    }

    user.email = req.body.email;
    user.secondName = req.body.secondName;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.fullName = `${req.body.secondName} ${req.body.firstName} ${req.body.lastName}`;
    user.password = req.body.password;

    await user.save()
        .then(results => res.send(results))
        .catch(error => {
            res.status(400).send(error)
        });
});

module.exports = router;