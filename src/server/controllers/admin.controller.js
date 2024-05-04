const ldap = require('../config/ldap')
const userModel = require('../models/user.model');
const getRole = require('../ulti/getRole')
const log = require('../config/log')
const fs = require('fs')

async function getPendingRegisterRequest(req,res){
    const users = await userModel.getAllPendingUser('new-user');

    return res.status(200).json({status: 200, data: {users: users}})
}

async function getPendingUpdateRequest(req,res){
    const users = await userModel.getAllPendingUser('update-user');
    return res.status(200).json({status: 200, data: {users: users}})

}

async function handleRegisterRequest(req,res){
    const logger = log.createLogger('./logs/account.log')
    const accept = req.body.accept;
    const uid = req.body.uid;

    const user = await userModel.getPendingUser(uid,'new-user');
    await userModel.deletePendingUSer(uid,'new-user');

    if (accept){
        await userModel.registerUser(user);
        for (const group of user.groups){
            await userModel.addUserToGroup(uid,group);
        }
        logger.info(`${new Date()}: Create account success: Admin ${res.locals.uid} created account for user ${uid} with roles ${user.groups.join(', ')}, IP: ${req.ip}`)
    }
    else{
        logger.info(`${new Date()}: Create account fail: Admin ${res.locals.uid} denied creating account for user ${uid} with roles ${user.groups.join(', ')}, IP: ${req.ip}`)
    }

    return res.status(200).json({status: 200, message: "handle register request sucsessfully"})

}

async function handleUpdateRequest(req,res){
    const logger = log.createLogger('./logs/account.log')
    const accept = req.body.accept;
    const uid = req.body.uid;

    const user = await userModel.getPendingUser(uid,'update-user');
    await userModel.deletePendingUSer(uid,'update-user');

    if (accept){
        for (const group of user.groups){
            await userModel.addUserToGroup(uid,group);
        }
        logger.info(`${new Date()}: Update role success: Admin ${res.locals.uid} updated role for user ${uid} with roles ${user.groups.join(', ')}, IP: ${req.ip}`)
    }
    else{
        logger.info(`${new Date()}: Update role fail: Admin ${res.locals.uid} denied updating role for user ${uid} with roles ${user.groups.join(', ')}, IP: ${req.ip}`)
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
    const logger = log.createLogger('./logs/account.log')
    const uid = req.body.uid;
    const groups = res.body.groups;
    for (const group of groups){
        await userModel.addUserToGroup(uid,group);
    }
    logger.info(`${new Date()}: Update role success: Admin ${res.locals.uid} updated role for user ${uid} with roles ${groups.join(', ')}, IP: ${req.ip}`)
    return res.status(200).json({status: 200, message: "handle admin request to add user to group sucsessfully"})

}

async function deleteUserFromGroup(req,res){
    const logger = log.createLogger('./logs/account.log')
    const uid = req.body.uid;
    const groups = res.body.groups;
    for (const group of groups){
        await userModel.deleteUserFromGroup(uid,group);
    }

    logger.info(`${new Date()}: Update role success: Admin ${res.locals.uid} removed roles of user ${uid} with roles ${groups.join(', ')}, IP: ${req.ip}`)
    return res.status(200).json({status: 200, message: "handle admin request to remove user from group sucsessfully"})

}

async function getAllNewUserForChooseUserForNewGroup(req,res){
    const users = await userModel.getAllUser();
    res.status(200).json({status: 200, data: {users: users}})
}

async function createNewGroup(req,res){
    const logger = log.createLogger('./logs/account.log')
    const uids = req.body.uids;
    const groupname = req.body.groupname;
    await userModel.addRole(groupname,uids);
    logger.info(`${new Date()}: Update group success: Admin ${res.locals.uid} created a new group with name ${groups.join(', ')} and users ${uids.join(', ')}, IP: ${req.ip}`)
    return res.status(200).json({status: 200, message: "handle admin request to add group sucsessfully"});
}

async function deleteGroup(req, res){
    const logger = log.createLogger('./logs/account.log')
    const groupname = req.body.groupname;
    await userModel.deleteRole(groupname);
    logger.info(`${new Date()}: Update group success: Admin ${res.locals.uid} deleted a group with name ${groups.join(', ')}, IP: ${req.ip}`)
    return res.status(200).json({status: 200, message: "handle admin request to remove group sucsessfully"});
}

async function getLog(req, res) {
    try {
        const logfilename = req.query.filename;

        if (logfilename!='account' && logfilename!='authentication'){
            return res.status(400).json({ error: 'Invalid log filename' });

        }
        fs.readFile(`./logs/${logfilename}.log`, 'utf8', async (err, content) => {
            if (err) {
                console.error('Error reading log file:', err);
                return res.status(500).json({ error: 'Error reading log file' });
            }
            const logdata = content
            res.status(200).json({ logdata: logdata });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function clearLog(req, res) {
    try {
        const logfilename = req.body.filename;

        if (logfilename!='account' && logfilename!='authentication'){
            return res.status(400).json({ error: 'Invalid log filename' });

        }
        fs.truncateSync(`./logs/${logfilename}.log`);
        res.status(200).json({ message: `Log file ${logfilename} cleared successfully.` });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
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
    getLog: getLog,
    clearLog: clearLog
}