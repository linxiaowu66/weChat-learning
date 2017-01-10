const request = require('../helper/request.js')
const User = require('../models/user.js')
const util = require('../helper/util.js')
import config from '../config'
import getSignature from '../helper/weixinSignature.js'

exports.index = (req, res) => {
  const openid = req.session.current_user
  User.findByOpenId(openid).then((data) => {
    if (data.length === 0) {
      res.render('404.pug', {
        msg: '获取用户信息失败，请重试'
      })
    }
    Promise.all([
      request.getCityList(),
      getSignature(`${config.domain}/index`)
    ])
    .then((result) => {
      console.log(result[1])
      res.render('index.pug', {
        appId: config.appId,
        weixin: result[1],
        lists: result[0],
        nickname: data[0].nickname,
        openid: data[0].openid
      })
    }).catch((err) => {
      console.error('Promise Error: ', err)
      res.render('404.pug', {
        msg: '获取用户信息失败，请重试',
        title: '服务器出错'
      })
    })
  }).catch((err) => {
    console.err('findByOpenId Error: ', err)
    res.render('404.pug', {
      msg: '获取用户信息失败，请重试',
      title: '服务器出错'
    })
  })
}
