//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')
const API = util.API

Page({
  data: {
    wishTitle: '',
    templateId: '',
    wishTempletCss: null
  },
  onLoad(opts) {
    const me = this
    const d = me.data

    d.templateId = opts.templateId

    me.getWishTempletCss(opts.templateId)
    me.setData(d)
  },
  setWishTitle(e) {
    const me = this
    const d = me.data

    d.wishTitle = e.detail.value
    me.setData(d)
  },

  buildWish() {

  },

  getWishTempletCss() {
    const me = this
    const d = me.data

    wx.request({
      url:API.getWishTempletCss,
      method: 'POST',
      data: {
        openId: wx.getStorageSync('openId'),
        wishTempletId: d.templateId
      },
      success:res=>{
        app.globalData.wishTempletCss = res.data.wishTempletCss
        app.globalData.wishTempletCss = {
          common: {
            bgTop:'https://image.guang.j.cn/static/imgs/zhufu/temp1/step1-1.png',
            bgMain:'https://image.guang.j.cn/static/imgs/zhufu/temp1/step1-3.png',
          },
          step1: {
            bgBottom: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step1-5.png',
            cardBg: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step1-4.png',
            cardTopIcon: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step1-2.png',
            cardInputBgColor: '#ffd0d1',
            cardInputTextColor: '#f5989a'
          },
          step2: {
            bgBottom: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step2-5.png',
            bgText: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step2-1.png',
            bgImage: '',
            bgAudio: '',
            bgVideo: '',
          },
          step3: {
            bgText: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step3-1.png',
            bgImage: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step3-4.png',
            bgAudio: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step3-2.png',
            bgVideo: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step3-3.png',
            bgBottom: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step3-5.png',
            bgCancel: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step3-6.png',
            bgConfirm: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step3-7.png',
            bgConfirmActive: 'https://image.guang.j.cn/static/imgs/zhufu/temp1/step3-8.png',
            textInputBgColor: '#ffd0d1',
            textInputColor: '#c17c7e'
          }
        }
        d.wishTempletCss = app.globalData.wishTempletCss
        me.setData(d)
      }
    })
  },

  submitTheme() {
    const me = this
    const d = me.data

    wx.showLoading({
      title: '正在创建祝福'
    })


    const userInfo = wx.getStorageSync('userInfo');
    const openId = wx.getStorageSync('openId')

    wx.request({
      url: API.buildWish,
      method: 'POST',
      data: {
        initiator: userInfo.nickName,
        openId: openId,
        wishTemplateId: d.templateId,
        wishTheme:d.wishTitle
      },
      success:res => {
        wx.hideLoading()
        console.log(res)
        wx.navigateTo({
          url: '/pages/cardlist/cardlist?wishId=' + res.data.wishId + '&wishTemplateId=' +res.data.wishTemplateId + '&wishThemeImgUrl=' +res.data.wishThemeImgUrl
        })
      }
    })


    me.setData(d)
  }
})
