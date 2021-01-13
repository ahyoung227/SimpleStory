const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('./models');
const passportConfig = require('./passport');
const app = express();
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan')

db.sequelize.sync({ force: true });
passportConfig();

app.use(morgan('dev'))
app.use(cors('http://localhost:3000'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookie());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "cookiesecret"
}));
app.use(session());
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.status(200).send("New express app");
})

app.post('/user', async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = await db.User.findOne({
            email: req.body.email,
        })
        if (exUser) {
            return res.status(403).json({
                errorCode: 1,
                message: 'Already exist'})
        }
        const newUser = await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });
        return res.status(201).json(newUser)
    } catch (err) {
        console.log(err);
        return next(err);
    }
});

const user = {

};

app.use('/user/login', (req, res) => {
    req.body.email
    user[user.id] = {

    }
})

app.listen(3085, () => {
    console.log(`backend ${3085} is ready`)
})
