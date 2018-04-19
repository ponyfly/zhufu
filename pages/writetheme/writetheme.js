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

  inputHandler(e) {
    if(e.detail.value.length === 9) {
      wx.showToast({
        title: '最多输入9个字',
        icon: 'none'
      })
    }
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
        d.wishTempletCss = app.globalData.wishTempletCss
        me.setData(d)
      }
    })
  },

  submitTheme() {
    const me = this
    const d = me.data

    if(!d.wishTitle) {
      wx.showToast({
        title: '请填写祝福主题',
        icon: 'none'
      })
      return
    }

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
        d.wishTitle = ''
        me.setData(d)
        wx.redirectTo({
          url: '/pages/cardlist/cardlist?toCreateCard=true&wishId=' + res.data.wishId + '&wishTemplateId=' +res.data.wishTemplateId + '&wishThemeImgUrl=' +res.data.wishThemeImgUrl
        })
      }
    })


    me.setData(d)
  }
})
