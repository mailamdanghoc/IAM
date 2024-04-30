// const ldap = require('ldapjs');

const ldap = require('../config/ldap');

// // LDAP server configuration
// const ldapClient = ldap.createClient({
//   url: 'ldap://127.0.0.1:10389',
// });

// // LDAP search options
// const searchOptions = {
//   filter: '(&(objectClass=organizationalUnit)(objectClass=groupOfNames))', // Filter to search for groups
//   scope: 'sub', // Search scope, 'sub' means to search the entire subtree
//   attributes: ['dn', 'ou', 'cn', 'member'], // Attributes to retrieve
// };

// // Perform LDAP search
// ldapClient.search('ou=group,dc=example,dc=com', searchOptions, (err, res) => {
//   if (err) {
//     console.error('LDAP search error:', err);
//     return;
//   }

//   res.on('searchEntry', (entry) => {
//     // Log the entire entry object
//     console.log('Entry:', entry.object);

//     // Log specific attributes
//     console.log('DN:', entry.dn.toString());
//     console.log('OU:', entry.object.ou);
//     console.log('CN:', entry.object.cn);
//     console.log('Member:', entry.object.member);

//     // Each group entry found
//     const group = entry.object;
//     console.log('Group:', group.cn);

//     // List members of the group
//     if (group.member) {
//       group.member.forEach((memberDN) => {
//         console.log('Member DN:', memberDN);
//         // You can perform additional actions here with the member DNs
//       });
//     } else {
//       console.log('No members found for group:', group.cn);
//     }
//   });

//   res.on('searchReference', (referral) => {
//     console.log('Referral:', referral);
//   });

//   res.on('error', (err) => {
//     console.error('LDAP search error:', err.message);
//   });

//   res.on('end', () => {
//     console.log('LDAP search complete.');
//     ldapClient.unbind();
//   });
// });
function addUser(error,client){
    const entry = {
        cn: 'testUser',
        sn: 'user',
        objectClass: ['inetOrgPerson', 'organizationalPerson','person'],
        mail: 'testUser@gmail.com',
        telephoneNumber: '0123456789',
        uid: 'testUser',
        userPassword: '123456',
    }

    client.add('uid=testUser,ou=people,dc=example,dc=com',entry,(err)=>{
        if (err) console.log("err add new user: "+ err.message);
        else console.log("user added")
        client.unbind()
    })
}

ldap.connectToLDAPServer(addUser)