const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', userController.getProfile);

router.get('/groupinfo', userController.getAllUserHaveSameGroup);

router.post('/modifygroup',userController.pendingForAddToGroup);

router.get('/modifygroup',userController.getGroupUserNotBelongTo)

router.post('/leavegroup', userController.deleteFromGroup);
router.get('/leavegroup', userController.getGroupUserBelongTo)

router.post('/deleteAccount', userController.deleteAccount);

module.exports = router;