const express = require('express')
const userController = require('../controllers/userController.js')
const expressController = require('../controllers/todoController.js')

// eslint-disable-next-line new-cap
const router = express.Router()

/* eslint no-unused-vars: 0 */

router.get('/', userController.redirectIndex)

/**
 * 认证授权后回调函数
 *
 * 根据openid判断是否用户已经存在
 * - 如果是新用户，注册并绑定，然后跳转到手机号验证界面
 * - 如果是老用户，跳转到主页
 */
router.get('/callback', userController.authUser)

// 微信服务器验证本台服务器的有效性
router.get('/getsignature', userController.getSignature)

router.get('/index', expressController.index)

router.post('/search', expressController.search)

module.exports = router;
