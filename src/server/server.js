var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const createSessionConfig = require('./config/session');

const authRoute = require('./routes/auth.route');


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const cspConfig = {
  directives: {
    scriptSrc: ["'self'", "ajax.googleapis.com", "cdn.jsdelivr.net", "www.google.com"],
    frameSrc: ["'self'", "www.google.com"],
  },
};


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.contentSecurityPolicy(cspConfig));
app.use(limiter);
app.use(cors({ origin: "http://localhost:3000" }))
app.use(cookieParser());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));


app.use("/auth", authRoute);

app.listen(8080);




// var express = require('express');
// var app = express();
// var ldap = require('ldapjs');


// app.listen(3000, function () {
//     console.log("server started")
// })

// /*update the url according to your ldap address*/
// var client = ldap.createClient({
//     url: 'ldap://127.0.0.1:10389'
// });

// /*use this to create connection*/
// function authenticateDN(username, password) {

//     /*bind use for authentication*/
//     client.bind(username, password, function (err) {
//         if (err) {
//             console.log("Error in new connetion " + err)
//         } else {
//             /*if connection is success then go for any operation*/
//             console.log("Success");
//             //searchUser();
//             addUser();
//             //deleteUser();
//             //addUserToGroup('cn=Administrators,ou=groups,ou=system');
//             //deleteUserFromGroup('cn=Administrators,ou=groups,ou=system');
//             //updateUser('cn=test,ou=users,ou=system');
//             //compare('cn=kiwi,ou=users,ou=system');
//             //modifyDN('cn=bar,ou=users,ou=system');

//         }
//     });
// }

// /*use this to search user, add your condition inside filter*/
// function searchUser() {
//     var opts = {
//         filter: '(objectClass=*)',
//         attributes: ['sn']
//     };

//     client.search('ou=users,ou=system', opts, function (err, res) {
//         if (err) {
//             console.log("Error in search " + err);
//             // Handle error appropriately, e.g., return or log the error
//         } else {
//             res.on('searchEntry', function (entry) {
//                 console.log('entry: ' + JSON.stringify(entry.object));
//             });
//             res.on('searchReference', function (referral) {
//                 console.log('referral: ' + referral.uris.join());
//             });
//             res.on('error', function (err) {
//                 console.error('error: ' + err.message);
//             });
//             res.on('end', function (result) {
//                 console.log('status: ' + result.status);
//             });
//         }
//     });
// }

// /*use this to add user*/
// function addUser() {
//     var entry = {
//         cn: 'testUser',
//         sn: 'user',
//         objectclass: ['inetOrgPerson', 'organizationalPerson', 'person']
//     };
//     client.add('cn=testUser,ou=users,ou=system', entry, function (err) {
//         if (err) {
//             console.log("err in new user " + err.message);
//         } else {
//             console.log("added user")
//         }
//     });
// }

// /*use this to delete user*/
// function deleteUser() {
//     client.del('cn=userTest,ou=users,ou=system', function (err) {
//         if (err) {
//             console.log("err in delete new user " + err);
//         } else {
//             console.log("deleted user")
//         }
//     });
// }

// /*use this to add user to group*/
// function addUserToGroup(groupname) {
//     var change = new ldap.Change({
//         operation: 'add',
//         modification: {
//             uniqueMember: 'cn=jill,ou=users,ou=system'
//         }
//     });

//     client.modify(groupname, change, function (err) {
//         if (err) {
//             console.log("err in add user in a group " + err);
//         } else {
//             console.log("added user in a group")
//         }
//     });
// }

// /*use this to delete user from group*/
// function deleteUserFromGroup(groupname) {
//     var change = new ldap.Change({
//         operation: 'delete',
//         modification: {
//             uniqueMember: 'cn=hiii,ou=users,ou=system'
//         }
//     });

//     client.modify(groupname, change, function (err) {
//         if (err) {
//             console.log("err in delete  user in a group " + err);
//         } else {
//             console.log("deleted  user from a group")
//         }
//     });
// }

// /*use this to update user attributes*/
// function updateUser(dn) {
//     var change = new ldap.Change({
//         operation: 'add',  //use add to add new attribute
//         //operation: 'replace', // use replace to update the existing attribute
//         modification: {
//             displayName: '657'
//         }
//     });

//     client.modify(dn, change, function (err) {
//         if (err) {
//             console.log("err in update user " + err);
//         } else {
//             console.log("add update user");
//         }
//     });
// }

// /*use this to compare user is already existed or not*/
// function compare(dn) {
//     client.compare(dn, 'sn', 'tlq', function (err, matched) {
//         if (err) {
//             console.log("err in compare user " + err);
//         } else {
//             console.log("result :" + matched);
//         }
//     });
// }

// /*use this to modify the dn of existing user*/
// function modifyDN(dn) {

//     client.modifyDN(dn, 'cn=ba4r', function (err) {
//         if (err) {
//             console.log("err in update user " + err);
//         } else {
//             console.log("result :");
//         }
//     });
// }

// /*create authentication*/
// authenticateDN("uid=admin,ou=system", "123456")
// // authenticateDN("cn=admin,dc=mmanm,dc=com", "123456")
// //authenticateDN("uid=admin,ou=system", "secret")