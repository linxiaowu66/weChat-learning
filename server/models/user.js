/* eslint-disable new-cap */

const mongoose = require('mongoose')

const schema = mongoose.Schema({
  unionid: String,
  openid: {// from weixin openid
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  nickname: String, // from weixin 昵称
  sex: String, // from weixin 性别 0->女 1->男
  language: String, // from weixin 语言
  city: String, // from weixin 城市
  province: String, // from weixin
  country: String, // from weixin
  headimgurl: String, // from weixin 头像路径
  privilege: [],    // from weixin
  created_at: {
    type: Date,
    default: Date.now
  }
})

const user = mongoose.model('user', schema)

module.exports = {
  create(params) {
    const instance = new user(params)
    return instance.save()
  },
  // 注意这个API返回的是一个只有一个参数的数组
  findByUnionId(unionid) {
    if (!unionid) {
      return Promise.reject('缺少参数')
    }
    return user.find({ unionid }).limit(1).exec()
  },
  findByOpenId(openId) {
    if (!openId) {
      return Promise.reject('缺少参数')
    }
    return user.find({ openid: openId }).limit(1).exec()
  }
}
