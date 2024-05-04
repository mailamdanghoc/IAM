function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;
    console.log(uid)
    if (!uid) {
        return next();
    }
    console.log(uid)
    res.locals.uid = uid;
    res.locals.isAuth = req.session.isAuth;
    res.locals.isAdmin = req.session.isAdmin;
    next();
}

module.exports = checkAuthStatus;