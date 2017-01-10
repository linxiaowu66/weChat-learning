const STATUS_OK = 0;
const STATUS_ERR = 1;
// const STATUS_EMPTY = 2;
// eslint-disable-next-line no-unused-vars
const isArray = arr => Object.prototype.toString.call(arr) === '[object Array]'

const format = (err, data, errCode) => {
  if (err) {
    return {
      status: STATUS_ERR,
      msg: err.toString(),
      code: errCode
    };
  }
  const resultType = typeof (data);
  if (resultType === 'object' || resultType === 'string') {
    return {
      status: STATUS_OK,
      data
    };
  }
  return {
    status: STATUS_ERR,
    msg: 'result格式不正确'
  };
}

export default format
