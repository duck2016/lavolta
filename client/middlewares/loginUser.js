const uuid = require('uuid/v4');

module.exports = function(req, res, next) {
    if (!req.session.userId) {
        const userId = uuid();
        req.session.userId = userId;
        res.cookie('userId', userId);
    }
    next();
};
