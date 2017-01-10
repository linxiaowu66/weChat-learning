/* eslint no-console: 0 */

import format from '../helper/util'
import config from '../config'
import getSignature from '../helper/weixinSignature'

const request = require('../helper/request.js')
const User = require('../models/user.js')


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
        msg: '获取城市列表失败，请重试',
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

// 这里没有实际真的去完成搜索功能，而是简单地再次返回原来的列表

exports.search = (req, res) => {
  const openid = req.session.current_user
  User.findByOpenId(openid).then((data) => {
    if (data.length === 0) {
      res.send(format('获取用户信息失败，请重试', null, 10000))
    }
    request.getCityList()
    .then((result) => {
      res.send(format(null, result))
    }).catch((err) => {
      console.error('Promise Error: ', err)
      res.send(format('获取城市列表失败，请重试', null, 10001))
    })
  }).catch((err) => {
    console.err('findByOpenId Error: ', err)
    res.send(format('获取用户信息失败，请重试', null, 10002))
  })
}
