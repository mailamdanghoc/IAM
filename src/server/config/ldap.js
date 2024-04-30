const ldap = require('ldapjs');

const ldapConfig = {
    url: 'ldap://127.0.0.1:10389', // LDAP server URL
    bindDN: 'uid=admin,ou=system', // Bind DN (username)
    bindCredentials: '123456', // Bind credentials (password)
    searchBase: 'dc=example,dc=com', // Base DN for user search
   
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

module.exports = {
    connectToLDAPServer: connectToLDAPServer
};
