const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');

const db = require('../models')
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
dotenv.config();

AWS.config.update({
    region: "us-east-2",
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY,
});

const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'simple-sns',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}${path.basename(file.originalname)}`)
        },
    }),
    limit: { fileSize: 20 * 1024 * 1024 },
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res) => {
    try {
        res.json(req.files.map(v => v.location));
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
            const hashtags = req.body.content.match(/#[^\s#]+/g);
            const newPost = await db.Post.create({
                content: req.body.content,
                UserId: req.user.id
            });

        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() }
            })));
            await newPost.addHashtags(result.map(r=> r[0]))
        }
        if (req.body.image) {
            if(Array.isArray(req.body.image)) {
                await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({
                        src: image,
                        PostId: newPost.id
                    });
                }));
            } else {
                await db.Image.create({ src: req.body.image , postId: newPost.id });
            }
        }
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }, {
                model: db.Image
            }, {
                model:db.User,
                as: 'Likers',
                attributes: ['id']
            }],
        });
        return res.json(fullPost);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                id: req.params.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Image,
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image,
                }],
            }],
        });
        res.json(post)
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await db.Post.destroy({
            where: {
                id: req.params.id,
            }
        });
        res.send('Successfully deleted')
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({where: {id: req.params.id}});
        if (!post) {
            return res.status(404).send('Post does not exist');
        }
        console.log(post)
        const comments = await db.Comment.findAll({
            where: {
                postId: req.params.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }],
            order: [['createdAt', 'ASC']]
        });
        res.json(comments)
    } catch (err) {
        console.error(err)
        next(err);
    }
})

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({where: {id: req.params.id }});
        if (!post) {
            return res.status(404).send('Post does not exist');
        }
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });
        const comment = await db.Comment.findOne({
            where: {
                id: newComment.id,
            },
            include: [{
                model: db.User,
                attribute: ['id', 'nickname']
            }],
        });
        return res.json(comment)
    } catch (err) {
        next(err);
    }
})

router.post('/:id/retweet', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
            include: [{
                model: db.Post,
                as: 'Retweet',
            }],
        });
        if (!post) {
            return res.status(404).send('Post does not exist.');
        }
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('You cannot retweet your own post.')
        }
            const retweetTargetId = post.RetweetId || post.id;
            const exPost = await db.Post.findOne({
                where: {
                    UserId: req.user.id,
                    RetweetId: retweetTargetId
                },
            });
            if (exPost) {
                return res.status(403).send('You already retweeted this post')
            }
        const retweet = await db.Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet'
        });
            const retweetWithPrevPost = await db.Post.findOne({
                where: {id: retweet.id},
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model:db.User,
                    as: 'Likers',
                    attributes: ['id']
                }, {
                    model: db.Post,
                    as: 'Retweet',
                    include: [{
                        model: db.User,
                        attributes: ['id', 'nickname'],
                    }, {
                        model: db.Image,
                    }],
                }]
            })
            res.json(retweetWithPrevPost);
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {id: req.params.id }
        });
        if(!post) {
            return res.status(404).send('Post does not exist');
        }
        await post.addLiker(req.user.id);
        res.json({ userId: req.user.id })

    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({where: {id: req.params.id }});
        if(!post) {
            return res.status(404).send('Post does not exist.');
        }
        await post.removeLiker(req.user.id)
        res.json({ userId: req.user.id })
    } catch (e) {
        console.error(e);
        next(e);
    }
})

module.exports = router;
