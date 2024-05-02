const ldap = require('../config/ldap')
const userModel = require('../models/user.model');
const getRole = require('../ulti/getRole')

async function getPendingRegisterRequest(req,res){
    const users = await userModel.getAllPendingUser('new-user');

    return res.status(200).json({status: 200, data: {users: users}})
}

async function getPendingUpdateRequest(req,res){
    const users = await userModel.getAllPendingUser('update-user');
    return res.status(200).json({status: 200, data: {users: users}})

}

async function handleRegisterRequest(req,res){
    const accept = req.body.accept;
    const uid = req.body.uid;
    console.log(accept)

    const user = await userModel.getPendingUser(uid,'new-user');
    await userModel.deletePendingUSer(uid,'new-user');

    if (accept){
        await userModel.registerUser(user);
        for (const group of user.groups){
            await userModel.addUserToGroup(uid,group);
        }
    }

    return res.status(200).json({status: 200, message: "handle register request sucsessfully"})

}


async function handleUpdateRequest(req,res){
    const accept = req.body.accept;
    const uid = req.body.uid;

    const user = await userModel.getPendingUser(uid,'update-user');
    await userModel.deletePendingUSer(uid,'update-user');

    if (accept){
        for (const group of user.groups){
            await userModel.addUserToGroup(uid,group);
        }
    }

    return res.status(200).json({status: 200, message: "handle register request sucsessfully"})

}

async function getAllUserOfGroupInfo(req, res){
    const group = req.query.group;
    const availableGroup = await getRole();
   
    const users = []

    if (group){
        var userOfGroup = await userModel.getAllUserOfGroup(group)
        users.push({
            group: group,
            users: userOfGroup,
        })
    }
    else{
        for (const groupname of availableGroup){
            var userOfGroup = await userModel.getAllUserOfGroup(groupname)
            users.push({
                group: groupname,
                users: userOfGroup,
            })
        }
    }

    return res.status(200).json({status: 200, data:{
        usersData: users
    }})
}

async function getUserDetail(req, res){
    const uid = req.params.uid;
    const user = await userModel.getUser(uid);
    const userGroup = await userModel.getGroupOfUser(uid);
    user.groups = userGroup;

    res.status(200).json({status: 200, data: {user: user}})
}

async function getUserGroupToModify(req,res){
    const uid = req.params.uid;
    const getgroup = req.query.getgroup;
    const userGroup = await userModel.getGroupOfUser(uid);
    if (getgroup){
        return res.status(200).json({status: 200, data: {groups: userGroup}})
    }
    const allRole = await getRole();
    const unregistryGroup = allRole.filter(gr => !userGroup.includes(gr));
    res.status(200).json({status: 200, data: {groups: unregistryGroup}})

}

async function addUserToGroup(req, res){
    const uid = req.body.uid;
    const groups = res.body.groups;
    for (const group of groups){
        await userModel.addUserToGroup(uid,group);
    }

    return res.status(200).json({status: 200, message: "handle admin request to add user to group sucsessfully"})

}

async function deleteUserFromGroup(req,res){
    const uid = req.body.uid;
    const groups = res.body.groups;
    for (const group of groups){
        await userModel.deleteUserFromGroup(uid,group);
    }

    return res.status(200).json({status: 200, message: "handle admin request to remove user from group sucsessfully"})

}


async function getAllNewUserForChooseUserForNewGroup(req,res){
    const users = await userModel.getAllUser();
    res.status(200).json({status: 200, data: {users: users}})
}


async function createNewGroup(req,res){
    const uids = req.body.uids;
    const groupname = req.body.groupname;
    await userModel.addRole(groupname,uids);
    return res.status(200).json({status: 200, message: "handle admin request to add group sucsessfully"});
}

async function deleteGroup(req, res){
    const groupname = req.body.groupname;
    await userModel.deleteRole(groupname);
    return res.status(200).json({status: 200, message: "handle admin request to remove group sucsessfully"});
}


module.exports = {
    getPendingRegisterRequest: getPendingRegisterRequest,
    getPendingUpdateRequest: getPendingUpdateRequest,
    handleRegisterRequest: handleRegisterRequest,
    handleUpdateRequest: handleUpdateRequest,
    getAllUserOfGroupInfo: getAllUserOfGroupInfo,
    getUserGroupToModify: getUserGroupToModify,
    getUserDetail: getUserDetail,
    addUserToGroup: addUserToGroup,
    deleteUserFromGroup: deleteUserFromGroup,
    getAllNewUserForChooseUserForNewGroup: getAllNewUserForChooseUserForNewGroup,
    createNewGroup: createNewGroup,
    deleteGroup: deleteGroup,
}