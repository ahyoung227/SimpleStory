exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('Login is required')
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('It is not available for logged in users')
};