const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12)
        const newUser = await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });
        return res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err)
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            return res.json(user);
        });
    })(req, res, next);
})

router.post('/logout', isLoggedIn, (req, res) => {
        req.logout();
        req.session.destroy();
        return res.status(200).send('Logged out');
});

module.exports = router;
