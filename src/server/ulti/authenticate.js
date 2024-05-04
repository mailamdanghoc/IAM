function createUserSession(req, user, action) {
    req.session.uid = user.uid.toString();
    req.session.isAuth = user.isAuth;
    req.session.isAdmin = user.isAdmin;
    req.session.save(action);
} 

function destroyUserAuthSession(req) {
    req.session.isAuth = null;
    req.session.uid = null;
    req.session.isAdmin = null;
}

module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession
}