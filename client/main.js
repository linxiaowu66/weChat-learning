import $ from 'zepto'
import 'weui/dist/style/weui.min.css'
import './index.css'

/* eslint no-console: 0 */
/* eslint no-unused-vars: 0 */
// eslint-disable-next-line prefer-arrow-callback
$(function () {
  wx.ready(() => {
    // 微信扫码条形码
    $('.g-index-button').on('click', () => {
      wx.scanQRCode({
        needResult: 1,
        desc: 'scanQRCode desc',
        success(res) {
          console.log(JSON.stringify(res));
        }
      });
    })
  })
})
