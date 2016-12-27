'use strict';

const rp = require('request-promise')
import config from '../../config'

exports.getCityList = () => {
  return rp({
    url: `http://${config.dwdHost}:${config.dwdPort}/lists`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true // make the request transfer the response to json object automatically
  })
}
