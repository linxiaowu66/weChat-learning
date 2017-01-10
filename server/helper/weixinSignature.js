/* eslint import/no-extraneous-dependencies: 0*/
/* eslint-disable new-cap */
/* eslint guard-for-in: 0 */
/* eslint camelcase: 0 */

import cache from 'memory-cache'
import jsSHA from 'jssha'
import Debug from 'debug'
import config from '../config'

const rp = require('request-promise')

const debug = Debug('app:weixinSignature')

const raw = (args) => {
  let keys = Object.keys(args);
  keys = keys.sort()
  const newArgs = {};
  keys.forEach((key) => {
    newArgs[key.toLowerCase()] = args[key];
  });

  let string = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const k in newArgs) {
    string += `&${k}=${newArgs[k]}`;
  }
  string = string.substr(1);
  return string;
};

/**
* @synopsis 签名算法
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
const sign = (ticket, url) => {
  const timeStamp = parseInt(new Date().getTime() / 1000, 10)
  const ret = {
    jsapi_ticket: ticket,
    nonceStr: config.noncestr,
    timestamp: timeStamp,
    url
  };
  const string = raw(ret)
  const shaObj = new jsSHA(string, 'TEXT');

  ret.signature = shaObj.getHash('SHA-1', 'HEX');

  debug(`jsapi_ticket=${ticket}&noncestr=${config.noncestr}&url=${url}&timestamp=${timeStamp}`)
  return ret
}

const getSignature = url => new Promise((resolve, reject) => {
  try {
    let jsapiTicket

    if (cache.get('ticket')) {
      jsapiTicket = cache.get('ticket');
      console.log('cache found: ', jsapiTicket)
      resolve(sign(jsapiTicket, url))
    }

    rp(`${config.accessTokenUrl}?grant_type=${config.grant_type}&appid=${config.appId}&secret=${config.appSecret}`)
      .then((body) => {
        console.log('cache not found1: ', JSON.parse(body))
        const { access_token } = JSON.parse(body)
        return rp(`${config.ticketUrl}?access_token=${access_token}&type=jsapi`)
      })
      .then((json) => {
        console.log('cache not found2: ', JSON.parse(json))
        const { ticket, expires_in } = JSON.parse(json)
        cache.put('ticket', ticket, expires_in * 1000, () => { console.log('timeout occuring!!!!!') });  // 加入缓存
        console.log(cache.get('ticket'));
        resolve(sign(ticket, url))
      })
      .catch((err) => {
        debug('getSignature Error: ', err)
        reject(err)
      })
  } catch (err) {
    reject(err)
  }
})

export default getSignature
