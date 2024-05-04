const ldap = require('ldapjs');
require('dotenv').config()

const ldapConfig = {
    url: process.env.LDAP_URI , // LDAP server URL
    bindDN: process.env.BIND_DN, // Bind DN (username)
    bindCredentials: process.env.BIND_CREDENTIALS, // Bind credentials (password)   
};

function connectToLDAPServer(callback) {
    let client = ldap.createClient({
        url: ldapConfig.url
    });

    client.bind(ldapConfig.bindDN, ldapConfig.bindCredentials, (err) => {
        if (err) {
            console.error("Error connecting to LDAP server:", err);
            callback(err, null);
        } else {
            //console.log("Connected to LDAP server successfully");
            callback(null, client);
        }
    });
}

connectToLDAPServer()

module.exports = {
    connectToLDAPServer: connectToLDAPServer
};
