const config = {
  host: '0.0.0.0',
  port: 9090,
  dwdHost: '192.168.56.101',
  dwdPort: '3000',
  appId: 'wx7f70a1cadda24881',
  appSecret: '5da26c0c6d1b9cf5cef5baf76ee784a8',
  noncestr: 'Wm3WZYTPz0wzccnW',
  grant_type: 'client_credential',
  accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
  ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
  cache_duration: 1000 * 60 * 60 * 2, // 缓存时长为2小时
  domain: 'http://1626828za5.imwork.net',
  appToken: '11111111',
  cache_json_file: "/tmp",
  mongoUrl: "mongodb://localhost/weixin"
}


module.exports = config
