module.exports = function(req, res, next) {
    const user = { userId: req.session.userId };
    res.locals.user = user;
    req.user = user;
    next();
};
