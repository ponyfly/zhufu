const app = getApp()
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
    wishTemplateId: '',
    wishId:'',
    isShowType: false,
    isAuthAllow: true,
    recorderManager: '',
    innerAudioContext: '',
    wishTempletCss: null,
    initiator: '',
    wishCards: [],
    wishThemeImgUrl: '',
    cardsNum: 0,
    ...type.data
  },

  onLoad: function (opts) {
    const me = this
    const d = me.data
    d.innerAudioContext = wx.createInnerAudioContext()
    d.wishTemplateId = opts.wishTemplateId
    d.wishId = opts.wishId
    if (app.globalData.wishTempletCss) {
      d.wishTempletCss = app.globalData.wishTempletCss
    } else {
      me.getWishTempletCss()
    }
    me.setData(d)
    me.initRecorderManager()
    me.getOpenId(function () {
      me.getWishCards()
    })
  },

  getWishTempletCss() {
    const me = this
    const d = me.data

    wx.request({
      url:API.getWishTempletCss,
      method: 'POST',
      data: {
        openId: wx.getStorageSync('openId'),
        wishTempletId: d.wishTemplateId
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

  initRecorderManager() {
    const me = this
    const d = me.data
    d.recorderManager = wx.getRecorderManager()
    d.recorderManager.onStart(() => {
      console.log('recorder start')
    })

    d.recorderManager.onStop((res) => {
      console.log('recorder stop')
      const {tempFilePath} = res
      d.isStart = false
      d.isAfterWrite = true
      d.dataUrl = tempFilePath
      me.setData(d)
    })

    d.recorderManager.onError(() => {
      const me = this
      const d = me.data
      d.isStart = true
      me.setData(d)
      console.log('录音权限授权失败')
    })

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
        const {initiator, wishCards, wishThemeImgUrl, cardsNum} = res.data
        d.initiator = initiator
        d.wishCards = wishCards
        d.wishThemeImgUrl = wishThemeImgUrl
        d.cardsNum = cardsNum
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