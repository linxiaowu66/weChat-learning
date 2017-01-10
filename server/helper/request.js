import config from '../config'

const rp = require('request-promise')

exports.getCityList = () => rp({
  url: `http://${config.jsonHost}:${config.jsonPort}/lists`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  json: true // make the request transfer the response to json object automatically
})
