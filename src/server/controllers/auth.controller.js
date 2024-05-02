const ldap = require('../config/ldap');
const db = require('../config/mongodb');
const getRole = require('../ulti/getRole');
const validateUserInput = require('../ulti/validation');
const authUlti = require('../ulti/authenticate');
const authModel = require('../models/auth.model')
const userModel = require('../models/user.model')

async function login(req, res) {
    try {
        const { mail, password } = req.body;
        const uid = mail.split('@')[0];
        const checkAuth = await authModel.checkAuth(uid,password);

        if (!checkAuth){
            res.status(400).json({ status: 400, message: 'Invalid credentials' });
        }

        const isAdmin = await userModel.checkUserInGroup(uid,'Administrator');

        authUlti.createUserSession(req,{uid: uid, isAdmin: isAdmin}, () => {
            res.status(200).json({ status: 200, message: 'Login successful', isAdmin: isAdmin });
        })
        
    } catch (err) {
        console.error('LDAP connection error:', err);
        res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}

async function getRegister(req,res){
    try {
        const roles = await getRole();
        res.status(200).json({status: 200, data: {roles: roles}})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 500, message: "internal server error"})
    }
}

async function register(req,res){
    const userData = {
        email: req.body.email,
        password: req.body.password,
        confirmPass: req.body.confirmPass,
        phoneNumber: req.body.phoneNumber,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        roles: req.body.roles // this is an array
    }

    const message = await validateUserInput(userData)
    if (message){
        res.status(400).json({status: 400, message: message})
    }
    else{

        const userParser = {
            uid: userData.email.split('@')[0],
            mail: userData.email,
            cn: userData.firstName,
            sn: userData.lastName,
            telephoneNumber: userData.phoneNumber,
            roles: userData.roles,
            userPassword: userData.password,
        }

        await userModel.pendingUser(userParser,'new-user')
        res.status(200).json({status: 200, message: 'Your register need to be approved by administrator'})
    }
}

function logout(req, res) {
    authUlti.destroyUserAuthSession(req);
    res.status(200).json({status: 200, message: 'user logout successfully'})    
}

module.exports = {
    login: login,
    getRegister: getRegister,
    register: register,
    logout: logout,
};
