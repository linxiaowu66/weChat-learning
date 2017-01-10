const OAuth = require('wechat-oauth')
const request = require('../helper/request.js')
const User = require('../models/user.js')
import config from '../../config'
const client = new OAuth(config.appId, config.appSecret)


exports.redirectIndex = (req, res) => {
  const url = client.getAuthorizeURL(`${config.domain}/callback`, '', 'snsapi_userinfo')

  // 重定向请求到微信服务器
  res.redirect(url)
}

exports.authUser = (req, res) => {
  console.log('----weixin callback -----')
  const code = req.query.code
  try {
    client.getAccessToken(code, (err, result) => {
      if (err) {
        console.error('getAccessToken error: ', err)
        return
      }
      const accessToken = result.data.access_token
      const openid = result.data.openid
      const unionid = result.data.unionid

      User.findByOpenId(openid)
      .then((user) => {
        if (user.length === 0) {
          client.getUser(openid, (err, user) => {
            User.create(user)
              .then((data) => {
                req.session.current_user = user.openid
                res.redirect('index')
              })
              .catch((err) => {
                console.error(`User save error ....${err}`)
              })
          })
        } else {
          req.session.current_user = user[0].openid
          res.redirect('index')
        }
      })
      .catch((err) => {
        console.error('findByOpenId Error: ', err)
      })
    })
  } catch (err) {
    console.error('authUser Error: ', err)
  }
}

exports.getSignature = (req, res) => {
  const signature = req.query.signature
  const timestamp = req.query.timestamp
  const nonce = req.query.nonce
  const echostr = req.query.echostr

  /*  加密/校验流程如下： */
  // 1. 将token、timestamp、nonce三个参数进行字典序排序
  const array = new Array(config.appToken, timestamp, nonce)
  array.sort()
  const str = array.toString().replace(/,/g, '')

  // 2. 将三个参数字符串拼接成一个字符串进行sha1加密
  const sha1Code = crypto.createHash('sha1')
  const code = sha1Code.update(str, 'utf-8').digest('hex')

  // 3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (code === signature) {
    res.send(echostr)
  } else {
    res.send('error')
  }
}
