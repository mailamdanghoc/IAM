const express = require('express');

const adminController = require('../controllers/admin.controller')

const router = express.Router();

router.get('/pendingRegisterRequest',adminController.getPendingRegisterRequest)

router.get('/pendingUpdateRequest',adminController.getPendingUpdateRequest)

router.post('/handleRegisterRequest',adminController.handleRegisterRequest)

router.post('/handleUpdateRequest',adminController.handleUpdateRequest)

router.get('/groupinfo',adminController.getAllUserOfGroupInfo)

router.get('/groupinfor/detail/:uid',adminController.getUserDetail)

router.get('/getUserGroupToModify/:uid',adminController.getUserGroupToModify)

router.post('/addUserToGroup',adminController.addUserToGroup)

router.post('/deleteUserFromGroup',adminController.deleteUserFromGroup)

router.get('/createNewGroup',adminController.getAllNewUserForChooseUserForNewGroup)

router.post('/createNewGroup',adminController.createNewGroup)

router.post('/deleteGroup',adminController.deleteGroup)

router.get('/getlog',adminController.getLog)

router.post('/deletelog',adminController.clearLog)


module.exports = router;