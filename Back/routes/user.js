const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user;
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
    }
})

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = await db.User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (exUser) {
            return res.status(403).json({
                errorCode:1,
                message: 'You already signed up'
            })
        }
        await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            if (info) {
                return res.status(401).send(info.reason);
            }
            return req.login(user, async (err) => {
                if (err) {
                    console.error(err);
                    return next(err);
                }
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    attributes: ['id', 'email', 'nickname'],
                    include: [{
                        model: db.Post,
                        attributes: ['id']
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }]
                });
                return res.status(201).json(fullUser);
            })
        }) (req, res, next);
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    try {
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
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    attributes: ['id', 'email', 'nickname'],
                    include: [{
                        model: db.Post,
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id']
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id']
                    }],
                });
                return res.json(fullUser);
            });
        }) (req, res, next);
    } catch (err) {
        console.error(err);
        return next(err);
    }
})

router.post('/logout', isLoggedIn, (req, res) => {
        req.logout();
        req.session.destroy();
        return res.status(200).send('Logged out');
});

module.exports = router;
