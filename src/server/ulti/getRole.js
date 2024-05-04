const ldap = require('../config/ldap');

function getRole() {
    return new Promise((resolve, reject) => {
        var roles = []
        ldap.connectToLDAPServer((err, client) => {
            if (err) {
                reject(err);
                return;
            }

            const searchOptions = {
                filter: '(objectClass=groupOfNames)', // Filter to search for groups
                scope: 'sub', // Search scope, 'sub' means to search the entire subtree
                attributes: ['cn'], // Attributes to retrieve
            };

            // Perform LDAP search
            client.search('ou=group,dc=example,dc=com', searchOptions, (err, res) => {
                if (err) {
                    client.unbind();
                    reject(err);
                    return;
                }

                res.on('searchEntry', (entry) => {
                    console.log('Group:', JSON.stringify(entry.pojo.attributes[0].values));
                    roles.push(entry.pojo.attributes[0].values[0])
                });

                res.on('error', (err) => {
                    console.error('LDAP search error:', err.message);
                    reject(err);
                });

                res.on('end', () => {
                    console.log('LDAP search complete.');
                    client.unbind();
                    resolve(roles);
                });
            });
        });
    });
}

module.exports = getRole;
