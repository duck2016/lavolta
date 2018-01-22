module.exports = function(err, req, res, next) {
    if (err) return next(err);
    next();
};
