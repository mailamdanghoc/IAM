function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;
    if (!uid) {
        return next();
    }

    res.locals.uid = uid;
    res.locals.isAuth = req.session.isAuth;
    res.locals.isAdmin = req.session.isAdmin;
    next();
}

module.exports = checkAuthStatus;