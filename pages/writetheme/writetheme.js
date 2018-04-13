//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')
const API = util.API

Page({
  data: {
    wishTitle: '',
    templateId: ''
  },
  onLoad(opts) {
    const me = this
    const d = me.data

    d.templateId = opts.templateId

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
