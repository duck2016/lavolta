// todo switch to POST
module.exports = function(req, res) {
    req.session = null;
    res.clearCookie('userId');
    res.redirect('/');
};
