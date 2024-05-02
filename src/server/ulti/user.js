const ldapjs = require('ldapjs')
const ldap = require('../config/ldap');
const db = require('../config/mongodb')

function getAllUser() {
    return new Promise((resolve, reject) => {
        const users = []
        ldap.connectToLDAPServer((err, client) => {
            const searchOptions = {
                filter: '(objectClass=inetOrgPerson)', // Filter to search for groups
                scope: 'sub', // Search scope, 'sub' means to search the entire subtree
                attributes: ['uid','mail','cn','sn','telephoneNumber'], // Attributes to retrieve
            };

            // Perform LDAP search
            client.search('ou=people,dc=example,dc=com', searchOptions, (err, res) => {
                if (err) {
                    client.unbind();
                    reject(err);
                    return;
                }

                res.on('searchEntry', (entry) => {
                    //console.log('person:', JSON.stringify(entry.pojo.attributes));
                    /*
                    person: [{"type":"mail","values":["testUser@gmail.com"]},
                        {"type":"telephoneNumber","values":["0123456789"]},
                        {"type":"sn","values":["user"]},
                        {"type":"cn","values":["testUser"]},
                        {"type":"uid","values":["testUser"]}]
                    
                    */
                    var user = {
                        mail: entry.pojo.attributes[0].values[0],
                        telephoneNumber: entry.pojo.attributes[1].values[0],
                        sn: entry.pojo.attributes[2].values[0],
                        cn: entry.pojo.attributes[3].values[0],
                        uid: entry.pojo.attributes[4].values[0],
                    }

                    users.push(user)
                });

                res.on('error', (err) => {
                    console.error('LDAP search error:', err.message);
                    reject(err);
                });

                res.on('end', () => {
                    console.log('LDAP search complete.');
                    client.unbind();
                    resolve(users);
                });
            });
        });
    });
}

function getUser(uid){
    return new Promise((resolve, reject) => {
        var user= null
        ldap.connectToLDAPServer((err, client) => {
            const searchOptions = {
                filter: `(&(uid=${uid})(objectClass=inetOrgPerson))`, // Filter to search for groups
                scope: 'sub', // Search scope, 'sub' means to search the entire subtree
                attributes: ['uid','mail','cn','sn','telephoneNumber'], // Attributes to retrieve
            };

            // Perform LDAP search
            client.search('ou=people,dc=example,dc=com', searchOptions, (err, res) => {
                if (err) {
                    client.unbind();
                    reject(err);
                    return;
                }

                res.on('searchEntry', (entry) => {
                    //console.log('person:', JSON.stringify(entry.pojo.attributes));
                    /*
                    person: [{"type":"mail","values":["testUser@gmail.com"]},
                        {"type":"telephoneNumber","values":["0123456789"]},
                        {"type":"sn","values":["user"]},
                        {"type":"cn","values":["testUser"]},
                        {"type":"uid","values":["testUser"]}]
                    
                    */
                    user = {
                        mail: entry.pojo.attributes[0].values[0],
                        telephoneNumber: entry.pojo.attributes[1].values[0],
                        sn: entry.pojo.attributes[2].values[0],
                        cn: entry.pojo.attributes[3].values[0],
                        uid: entry.pojo.attributes[4].values[0],
                    }
                });

                res.on('error', (err) => {
                    console.error('LDAP search error:', err.message);
                    reject(err);
                });

                res.on('end', () => {
                    console.log('LDAP search complete.');
                    client.unbind();
                    resolve(user);
                });
            });
        });
    });
}


function getGroupOfUser(uid){
    return new Promise((resolve, reject) => {
        const roles = []
        ldap.connectToLDAPServer((err, client) => {
            const searchOptions = {
                filter: `(member=uid=${uid},ou=people,dc=example,dc=com)`, // Filter to search for groups
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

async function getAllUserOfGroup(groupname) {
    return new Promise(async (resolve, reject) => { // Make the function async
        const users = [];
        ldap.connectToLDAPServer(async (err, client) => { // Make the callback function async
            if (err) {
                console.log(err);
                client.unbind();
                reject(err);
            }

            const searchOptions = {
                filter: `(cn=${groupname})`,
                scope: 'sub',
                attributes: ['member'],
            };

            // Perform LDAP search to find the group
            client.search('ou=group,dc=example,dc=com', searchOptions, async (err, res) => {
                if (err) {
                    console.log(err);
                    client.unbind();
                    reject(err);
                }

                res.on('searchEntry', async (entry) => {
                    const members = entry.pojo.attributes[0].values;
                    for (const member of members) {
                        console.log(member)
                        const uid = member.split(',')[0].split('=')[1];
                        try {
                            const user = await getUser(uid); // Await the result of getUser function
                            users.push(user);
                        } catch (error) {
                            console.error('Error fetching user:', error);
                        }
                    }

                    console.log('LDAP search for all user of group complete.');
                    client.unbind();
                    resolve(users);
                });

                // res.on('end', () => {
                    
                // });
            });
        });
    });
}

async function pendingUser(userData, collectionName){
    if (collectionName) collectionName = 'new-users';
    const user = {
        uid: userData.uid,
        mail: userData.mail,
        cn: userData.cn,
        sn: userData.sn,
        telephoneNumber: userData.telephoneNumber,
        userPassword: userData.userPassword,
        groups: userData.groups,
    }

    await db.getDb().collection(collectionName).insertOne(user);
}

async function deletePendingUSer(uid, collectionName){
    if (collectionName) collectionName = 'new-users';
    await db.getDb().collection(collectionName).deleteOne({uid: uid});
}

async function getAllPendingUser(collectionName){
    if (collectionName) collectionName = 'new-users';
    const newUsers = await db.getDb().collection(collectionName).find().toArray();

    return newUsers.map((userData)=>{
        return {
            uid: userData.uid,
            mail: userData.mail,
            cn: userData.cn,
            sn: userData.sn,
            telephoneNumber: userData.telephoneNumber,
            userPassword: userData.userPassword,
            groups: userData.groups,
        };
    });
}

async function getPendingUser(uid, collectionName){
    if (collectionName) collectionName = 'new-users';
    const userData = await db.getDb().collection(collectionName).findOne({uid: uid});

    return {
        uid: userData.uid,
        mail: userData.mail,
        cn: userData.cn,
        sn: userData.sn,
        telephoneNumber: userData.telephoneNumber,
        userPassword: userData.userPassword,
        groups: userData.groups,
    }
}


function registerUser(userData){
    return new Promise((resolve, reject) => {
        const user = {
            uid: userData.uid,
            mail: userData.mail,
            cn: userData.cn,
            sn: userData.sn,
            telephoneNumber: userData.telephoneNumber,
            userPassword: userData.userPassword,
            objectClass: ['inetOrgPerson', 'organizationalPerson', 'person']
        }
        ldap.connectToLDAPServer((err, client) => {
            client.add(`uid=${user.uid},ou=people,dc=example,dc=com`, user, (err,res)=>{
                if (err){
                    reject(err);
                }
                console.log("add user succesfully")
                client.unbind()
                resolve(res)
            });
        });
    });
}

function deleteUser(uid){
    return new Promise((resolve, reject) => {
        ldap.connectToLDAPServer((err, client) => {
            client.del(`uid=${uid},ou=people,dc=example,dc=com`, (err,res)=>{
                if (err){
                    reject(err);
                }
                console.log("delete user succesfully")
                client.unbind()
                resolve(res)
            });
        });
    });
}

function addUserToGroup(uid,groupname){
    return new Promise((resolve,reject) => {
        const change = new ldapjs.Change({
            operation: 'add',
            modification: {
                type: 'member',
                values: [`uid=${uid},ou=people,dc=example,dc=com`]
            }
        })
        ldap.connectToLDAPServer((err,client)=>{
            var groupnameDN = `cn=${groupname},ou=group,dc=example,dc=com`
            client.modify(groupnameDN, change, (err,res)=>{
                if(err){
                    console.log(err)
                    reject(err)
                }
                console.log(`users have been add to ${groupname} successfully`)
                client.unbind()
                resolve()
            })
        });
    })


}

function deleteUserFromGroup(uid,groupname){
    return new Promise((resolve,reject) => {
        const change = new ldapjs.Change({
            operation: 'delete',
            modification: {
                type: 'member',
                values: [`uid=${uid},ou=people,dc=example,dc=com`]
            }
        })
        ldap.connectToLDAPServer((err,client)=>{
            var groupnameDN = `cn=${groupname},ou=group,dc=example,dc=com`
            client.modify(groupnameDN, change, (err,res)=>{
                if(err){
                    console.log(err)
                    reject(err)
                }
                console.log(`users have been deleted from ${groupname} successfully`)
                client.unbind()
                resolve()
            })
        });


    })
}


function addRole(roleName){
    return new Promise((resolve, reject) => {
        const role = {
            member: 'uid=khanh.trankiwi,ou=people,dc=example,dc=com',
            objectClass: ['groupOfNames']
        }
        ldap.connectToLDAPServer((err, client) => {
            client.add(`cn=${roleName},ou=group,dc=example,dc=com`, role, (err,res)=>{
                if (err){
                    reject(err);
                }
                console.log("add roles succesfully")
                client.unbind()
                resolve(res)
            });
        });
    });
}


function deleteRole(roleName){
    return new Promise((resolve, reject) => {
        ldap.connectToLDAPServer((err, client) => {
            client.del(`cn=${roleName},ou=group,dc=example,dc=com`, (err,res)=>{
                if (err){
                    reject(err);
                }
                console.log("delete group succesfully")
                client.unbind()
                resolve(res)
            });
        });
    });
}

function pendingAddRole(user){

}


async function test(){

    // //test getUser(uid)
    // const user = await getUser('admin1234')
    // console.log(user)

    // //test getGroupOfUser
    // const roles = await getGroupOfUser('khanh.trankiwiee')
    // console.log(roles)

    //test getAllUserOfGroup
    // const users = await getAllUserOfGroup('Administrator')
    // console.log(users)


    //test add role and delete role
    await addRole('IT')
    //await deleteRole('IT')


    //test deleteuserfromgroup, addusertogroup
    // const data = ['Administrator', 'Manager']
    // for (i in data){
    //     await deleteUserFromGroup('admin123',data[i])
    //     console.log(data[i])
    // }
    

}

test()

module.exports = {
    getAllUser: getAllUser,
    getUser: getUser,
    getGroupOfUser: getGroupOfUser,
    getAllUserOfGroup: getAllUserOfGroup,
    
    pendingUser: pendingUser,
    deletePendingUSer: deletePendingUSer,
    getAllPendingUser: getAllPendingUser,
    getPendingUser: getPendingUser,


    registerUser: registerUser,
    deleteUser: deleteUser,
    addUserToGroup: addUserToGroup,
    deleteUserFromGroup: deleteUserFromGroup,


    addRole: addRole,
    deleteRole: deleteRole,
};
