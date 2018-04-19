//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')
const API = util.API
Page({
  data: {
    isHomeChecked: true,
    wishTemplates: [],
    myWishes: [],
    isAuthAllow: true,
    isLoadingMyWish: false
  },
  onLoad() {
    const me = this
    const d = me.data
    me.getOpenId(me.loadTemplates)

    me.setData(d)
  },
  loadTemplates() {
    const me = this
    const d = me.data
      wx.request({
        url:API.getWishTemplets,
        method: 'POST',
        data: {
          openId: wx.getStorageSync('openId')
        },
        success:res => {
          d.wishTemplates = d.wishTemplates.concat(res.data.wishTemplates)
          me.setData(d)
        }
      })
    me.setData(d)
  },
  getMyWishes() {
    const me = this
    const d = me.data
    if(d.isLoadingMyWish) {
      return
    }
    d.isLoadingMyWish = true
    wx.request({
      url:API.getMyWishes,
      method: 'POST',
      data: {
        openId: wx.getStorageSync('openId')
      },
      success:res=>{
        d.myWishes = d.myWishes.concat(res.data.myWishes)
        me.setData(d)
      },
      complete: () => {
        d.isLoadingMyWish = false
        me.setData(d)
      }
    })
  },
  tabHome() {
    const me = this
    const d = me.data
    d.isHomeChecked = true
    me.setData(d)
  },
  tabMyjoin() {
    const me = this
    const d = me.data
    d.isHomeChecked = false
    if(d.myWishes.length === 0) {
      me.getMyWishes()
    }
    me.setData(d)
  },
  goToWriteTheme(e) {
    const me = this
    const d = me.data

    me.getUserInfo(()=>{
      wx.navigateTo({
        url: '/pages/writetheme/writetheme?templateId=' + e.currentTarget.dataset.id
      })
    })

    me.setData(d)
  },
  userInfoHandler(opts) {
    const me = this
    const d = me.data

    me.getUserInfo(function(userInfo) {
      if (userInfo === null) {
        d.isAuthAllow = false
        me.setData(d)
        return
      }
      d.isAuthAllow = true
      me.setData(d)

    })
    me.setData(d)
  },
  goToCardList(e) {
    const me = this
    const d = me.data
    const index = e.currentTarget.dataset.index
    const curWish = d.myWishes[index]
    console.log(curWish)
    wx.navigateTo({
      url: '/pages/cardlist/cardlist?wishId='+ curWish.wishId +'&wishTemplateId=' + curWish.wishTemplateId+ '&wishCardOrder=' + curWish.order + '&wishThemeImgUrl=' + encodeURIComponent(curWish.wishThemeImgUrl)
    })

    /*
    *
    * */
  },
  ...util.methods
})
