const ldap = require('../config/ldap')
const userModel = require('../models/user.model')
const getRole = require('../ulti/getRole')
const authUlti = require('../ulti/authenticate');
const log = require('../config/log')
const fs = require('fs')


async function getProfile(req,res){
    const uid = res.locals.uid;
    const user = await userModel.getUser(uid);
    const userGroup = await userModel.getGroupOfUser(uid);
    user.groups = userGroup;

    res.status(200).json({status: 200, data: {user: user}})
}

async function getAllUserHaveSameGroup(req, res){
    const group = req.query.group;
    const uid = res.locals.uid;
    const userGroup = await userModel.getGroupOfUser(uid);
    if (group && !userGroup.includes(group)){
        return res.status(403).json({status: 403, message: "User doesn't have permission to see member of this group"})
    }

    console.log(userGroup)

    const users = []

    if (group){
        var userOfGroup = await userModel.getAllUserOfGroup(group)
        users.push({
            group: group,
            users: userOfGroup,
        })
    }
    else{
        for (groupname of userGroup){
            var userOfGroup = await userModel.getAllUserOfGroup(groupname)
            users.push({
                group: groupname,
                users: userOfGroup,
            })
        }
    }

    console.log(users)

    return res.status(200).json({status: 200, data:{
        usersData: users
    }})
}

async function deleteFromGroup(req,res){
    const logger = log.createLogger('./logs/account.log')
    const uid = res.locals.uid;
    const groups = req.body.groups;
    groups.forEach(async (group) => {
        await userModel.deleteUserFromGroup(uid,group)
    })
    logger.info(`${new Date()}: Delete role success: User ${res.locals.uid} left the following groups: ${groups.join(', ')}, IP: ${req.ip}`);

    return res.status(200).json({status: 200, message: "user have been removed from groups"})
}

async function pendingForAddToGroup(req,res){
    const logger = log.createLogger('./logs/account.log')
    const uid = res.locals.uid;
    const groups = req.body.groups;
    const des = req.body.description
    const allRole = await getRole();
    for (const group of groups){
        if (!allRole.includes(group)){
            return res.status(400).json({status: 400, message: "Invalid group register"});
        }
    }

    await userModel.pendingUser({
        uid: uid,
        roles: groups,
        description: des,
    }, 'update-user')
    logger.info(`${new Date()}: Pending request for role success: User ${res.locals.uid} requested to join the following groups: ${groups.join(', ')}, IP: ${req.ip}`);
    return res.status(200).json({status: 200, message: "Request to modify group have been pending"});

}   

async function getGroupUserNotBelongTo(req,res){
    const uid = res.locals.uid;
    const userGroup = await userModel.getGroupOfUser(uid);
    const allRole = await getRole();
    const unregistryGroup = allRole.filter(gr => !userGroup.includes(gr));
    res.status(200).json({status: 200, data: {groups: unregistryGroup}})

    
}

async function getGroupUserBelongTo(req,res){
    const uid = res.locals.uid;
    const userGroup = await userModel.getGroupOfUser(uid);
    res.status(200).json({status: 200, data: {groups: userGroup}})

}

async function deleteAccount(req,res){
    const logger = log.createLogger('./logs/account.log')
    const uid = res.locals.uid;
    const userGroup = await userModel.getGroupOfUser(uid);
    for (const group of userGroup){
        await userModel.deleteUserFromGroup(uid,group);
    }
    await userModel.deleteUser(uid);
    logger.info(`${new Date()}: Account Deleted: User ${uid} requested to delete self-account, group user used to belong to: ${userGroup.join(', ')}, IP: ${req.ip}`);
    authUlti.destroyUserAuthSession(req);
    return res.status(200).json({status: 200, message: "User account has been deleted"});
}

module.exports = {
    getProfile: getProfile,
    getAllUserHaveSameGroup: getAllUserHaveSameGroup,
    deleteFromGroup: deleteFromGroup,
    getGroupUserNotBelongTo: getGroupUserNotBelongTo,
    pendingForAddToGroup: pendingForAddToGroup,
    getGroupUserBelongTo: getGroupUserBelongTo,
    deleteAccount: deleteAccount,
}