const ldap = require('../config/ldap');
const db = require('../config/mongodb');
const getRole = require('../ulti/getRole');
const validateUserInput = require('../ulti/validation');

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Connect to LDAP server
        const client = await ldap.connectToLDAPServer((err,client)=>{
            // Construct the user's DN
            const objectDN = `uid=${email.split('@')[0]},ou=people,dc=example,dc=com`;

            // Attempt to bind with the user's DN and password
            client.bind(objectDN, password, (err) => {
                if (err) {
                    console.error('LDAP bind error:', err);
                    res.status(400).json({ status: 400, message: 'Invalid credentials' });
                } else {
                    console.log('LDAP bind successful');
                    res.status(200).json({ status: 200, message: 'Login successful' });
                }
            });
        });

        
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
        confirmPass: req.body.confirmPassword,
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
        await db.getDb().collection('register').insertOne(userData)
    }



}

module.exports = {
    login: login,
    getRegister: getRegister,
    register: register,
};
