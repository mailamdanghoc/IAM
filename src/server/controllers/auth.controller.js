const ldap = require('../config/ldap');
const db = require('../config/mongodb');
const getRole = require('../ulti/getRole');
const validateUserInput = require('../ulti/validation');
const authUlti = require('../ulti/authenticate');
const authModel = require('../models/auth.model')
const userModel = require('../models/user.model')
const log = require('../config/log')
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
require('dotenv').config()


function generateOTP() {
    return speakeasy.totp({
        secret: process.env.SECRET_KEY,
        digits: 6,
    });
}

async function sendOTP(email, otp) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
  
    let info = await transporter.sendMail({
        from: '"Simple IAM" <' + process.env.EMAIL_USERNAME + '>',
        to: email,
        subject: 'Your OTP for Login',
        text: `Your OTP for login is: ${otp}`,
    });
  
    console.log('Message sent: %s', info.messageId);
}



async function login(req, res) {
    try {
        const logger = log.createLogger('./logs/authentication.log')
        const { mail, password } = req.body;
        const uid = mail.split('@')[0];
        const checkAuth = await authModel.checkAuth(uid,password);

        if (!checkAuth){
            logger.error(`${new Date()}: Invalid Credential: Attemp to login from ${uid}, IP: ${req.ip}`)
            return res.status(400).json({ status: 400, message: 'Invalid credentials' });
        }

        const isAdmin = await userModel.checkUserInGroup(uid,'Administrator');

        const otp = generateOTP();
        req.session.otp = otp;

        authUlti.createUserSession(req,{uid: uid, isAuth:false, isAdmin: isAdmin}, async () => {
            try {
                await sendOTP(mail, otp);
                res.send('OTP sent to your email. Please enter it to complete login.');
            } catch (error) {
                console.error('Error sending OTP:', error);
                res.status(500).send('Error sending OTP. Please try again later.');
            }
        })
        
    } catch (err) {
        console.error('LDAP connection error:', err);
        res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}


async function verifyOtp(req,res){
    const logger = log.createLogger('./logs/authentication.log')
    const otp = req.body.otp; // Assuming OTP is sent in the request body

    // Retrieve the OTP from the user's session
    const storedOTP = req.session.otp;
    console.log(storedOTP)
    console.log(otp)

    // Verify the OTP
    const isValidOTP = speakeasy.totp.verify({
        secret: process.env.SECRET_KEY,
        token: otp,
        window: 1,
    });

    if (isValidOTP && storedOTP === otp) {
        delete req.session.otp;
        req.session.isAuth = true;
        logger.info(`${new Date()}: Login success: ${res.locals.isAdmin?'Admin':'User'} ${res.locals.uid} logged in system, IP: ${req.ip}`)
        res.status(200).json({ status: 200, message: 'Login successful', isAdmin: res.locals.isAdmin });
    } else {
        logger.info(`${new Date()}: Invalid otp: from ${res.locals.isAdmin?'Admin':'User'} ${res.locals.uid} IP: ${req.ip}`)
        res.status(400).json({message: 'Invalid OTP. Please try again.'});
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
    const logger = log.createLogger('./logs/authentication.log')
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
        logger.info(`${new Date()}: Registry success:  ${userData.email} registered for new account, IP: ${req.ip}`)
        res.status(200).json({status: 200, message: 'Your register need to be approved by administrator'})
    }
}

function logout(req, res) {
    const logger = log.createLogger('./logs/authentication.log')
    logger.info(`${new Date()}: Logout success: ${res.locals.isAdmin?'Admin':'User'} ${res.locals.uid} logged out system, IP: ${req.ip}`)
    authUlti.destroyUserAuthSession(req);
    res.status(200).json({status: 200, message: 'user logout successfully'})    
}




module.exports = {
    login: login,
    verifyOtp: verifyOtp,
    getRegister: getRegister,
    register: register,
    logout: logout,
};
