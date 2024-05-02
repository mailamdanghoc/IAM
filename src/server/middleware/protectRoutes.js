function protectRoutes(req, res, next) {
    // console.log(req.path)
    if (req.path.startsWith('/api/auth/logout') && !res.locals.isAuth){
        return res.status(400).json({status: 400, message: 'user must login to logout'});
    }

    if (req.path.startsWith('/api/auth') && !req.path.startsWith('/api/auth/logout') && res.locals.isAuth){
        return res.status(300).json({status: 300, message: 'User has already logined'});
    }

    if (!req.path.startsWith('/api/auth') && !res.locals.isAuth) {
        
        return res.status(401).json({status: 401, message:'user is not authenticated'});
    }

    if (req.path.startsWith('/api/admin') && !res.locals.isAdmin) {
        return res.status(403).json({status: 403, message: 'Not authorized'});
    }

    next();
}

module.exports = protectRoutes;