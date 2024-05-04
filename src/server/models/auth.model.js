const ldapjs = require('ldapjs')
const ldap = require('../config/ldap');

function checkAuth(uid, password){
    return new Promise((resolve, reject) => { // Make the function async
        ldap.connectToLDAPServer((err, client) => {
            if (err) {
                console.log(err);
                client.unbind();
                reject(err);
            }
            const objectDN = `uid=${uid},ou=people,dc=example,dc=com`;

            // Attempt to bind with the user's DN and password
            client.bind(objectDN, password, (err) => {
                if (err) {
                    console.error('LDAP bind error:', err);
                    resolve(false)
                } else {
                    console.log('LDAP bind successful');
                    client.unbind()
                    resolve(true)
                }
            });
            
        });
    });
}

module.exports = {
    checkAuth: checkAuth,
}