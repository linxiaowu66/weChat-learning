var path = require('path')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = 'client'
  return path.posix.join(assetsSubDirectory, _path)
}
