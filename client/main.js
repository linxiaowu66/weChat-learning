import $ from 'zepto'
import 'weui/dist/style/weui.min.css'
import './index.css'

/* eslint no-console: 0 */
/* eslint no-unused-vars: 0 */
// eslint-disable-next-line prefer-arrow-callback
$(function () {
  function showToast(msg, callback) {
    $('.g-message-toast-text').text(msg)
    $('.g-message-toast').css({ display: 'block' })
    setTimeout(() => {
      $('.g-message-toast-text').text()
      $('.g-message-toast').css({ display: 'none' })
      if (callback) {
        callback()
      }
    }, 2000)
  }

  function showSnack(title, msg) {
    $('.g-message-snack-bar').css({ display: 'block' })
    $('.g-message-snack-title').text(title)
    $('.g-message-snack-text').text(msg)
  }
  const generateOrderList = function (list) {
    let element = ''

    for (let i = 0; i < list.length; i += 1) {
      element += `
        <div class="weui-panel weui-panel_access g-mbottom-10">
          <section class="weui-panel__hd">
            <span>${list[i].order}</span>
            <span class='g-index-status'>${list[i].status}</span>
          </section>
          <section class="weui-panel__bd">
            <div class="weui-media-box weui-media-box_text">
              <p class="weui-media-box__desc">索引：${list[i].id}</p>
              <p class="weui-media-box__desc">时间：${list[i].date}</p>
              <p class="weui-media-box__desc">城市：${list[i].city}</p>
          </section>
          <section class="weui-panel__ft g-ta-right">
            <a class="weui-btn weui-btn_mini weui-btn_default g-mright-10 g-index-cancel">取消</a>
            <a class="weui-btn weui-btn_mini weui-btn_primary g-mright-10 g-index-finish">确认</a>
          </section>
        </div>
      `
    }

    return element
  }

  function orderSearch() {
    const code = $('.g-index-order-id').val()

    $.ajax({
      type: 'POST',
      url: '/search',
      data: { code },
      success(data) {
        if (!data.status) {
          const element = generateOrderList(data.data)
          $('#app .g-index-list').html(element)
        } else {
          showSnack('操作失败', data.msg)
        }
      }
    })
  }

  // 派件单搜索
  $('.g-index-search').on('click', () => {
    orderSearch()
  })

  // 直接回车搜索派件单
  $('#searchBar .weui-search-bar__form').on('submit', (e) => {
    e.preventDefault();
    orderSearch()
  })

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
