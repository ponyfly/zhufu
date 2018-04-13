//logs.js
const util = require('../../utils/util')
const API = util.API
const type = require('../../components/type')

Page({
  data: {
    bannerIndex: 4,
    bannerList: [1,2,3,4,5,6,7,8,9],
    indexPositoin: 50,
    start:1,
    round: 10,
    wishId:'',
    isShowType: false,
    isAuthAllow: true,
    ...type.data
  },

  onLoad: function(opts) {
    const me = this
    const d = me.data
    me.getOpenId(function () {
      me.getWishCards()
    })
    d.wishId = opts.wishId

    me.setData(d)
  },

  nextIndex() {
    const me = this
    const d = me.data
    if(d.bannerIndex < d.bannerList.length-1){
      d.bannerIndex++
    }
    me.setData(d)
  },
  
  preIndex() {
    const me = this
    const d = me.data
    if(d.bannerIndex > 3){
      d.bannerIndex--
    }
    me.setData(d)
  },

  setIndex(e) {
    const me = this
    const d = me.data
    d.bannerIndex = e.currentTarget.dataset.index
    me.setData(d)
  },

  getWishCards() {
    const me = this
    const d = me.data
    const openId = wx.getStorageSync('openId');
    wx.request({
      url: API.getWishCards,
      method: 'POST',
      data: {
        openId: openId,
        round: d.round,
        start: d.start,
        wishId: d.wishId,
      },
      success: res => {
        console.log( res.data.wishCards)
        me.setData(d)
      }
    })
  },
  createWish() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  joinWish() {
    const me = this
    const d = me.data

    me.getUserInfo(function() {
      d.isShowType = true
    })

    me.setData(d)
  },
  closeWishType() {
    const me = this
    const d = me.data

    d.isShowType = false

    me.setData(d)
  },
  stopPop() {

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
  toWriteWish(e) {
    const me = this
    const d = me.data
    d.isShowType = false
    d.typeId = e.target.id
    me.setData(d)
  },
  ...util.methods,
  ...type.methods
})