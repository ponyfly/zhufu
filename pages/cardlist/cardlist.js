const app = getApp()
const util = require('../../utils/util')
const API = util.API
const type = require('../../components/type')

Page({
  data: {
    bannerIndex: 3,
    bannerList: [{isShow:true}, {isShow:true}, {isShow:true},{isShow:true}, {isShow:true}, {isShow:true}, {isShow:true}],
    indexPositoin: 50,
    start:1,
    batchSize: 20,
    leftCardOrder: 1,
    rightCardOrder: 1,
    wishTemplateId: '',
    wishId:'',
    isShowType: false,
    isAuthAllow: true,
    recorderManager: '',
    innerAudioContext: '',
    videoContext:'',
    wishTempletCss: null,
    initiator: '',
    avators:[],
    wishThemeImgUrl: '',
    showCreatePanel: false,
    cardsNum: 0,
    firstGetCards: true,
    isShare: false,
    loadDirection: '',
    isLeftEnd:false,
    ...type.data
  },

  onLoad: function (opts) {
    console.log(opts)
    const me = this
    const d = me.data
    if(opts.toCreateCard === 'true') {
      d.showCreatePanel = true
    }
    if(opts.wishCardOrder) {
      // d.isShare = true

      d.wishCardOrder = parseInt(opts.wishCardOrder)

      d.leftCardOrder = Math.max(d.wishCardOrder - 10, 1)
      d.rightCardOrder = d.wishCardOrder + 10

      //塞空数据
      for(let i = 1; i< d.wishCardOrder; i++) {
        d.bannerList.splice(3,0,{isShow:false})
      }
      d.bannerIndex = parseInt(opts.wishCardOrder) + 2
      console.log(d.bannerIndex)
    } else {
      d.leftCardOrder = 1
      d.rightCardOrder = 20
    }



    d.wishTemplateId = opts.wishTemplateId
    d.wishId = parseInt(opts.wishId)
    d.wishThemeImgUrl = decodeURIComponent(opts.wishThemeImgUrl)
    //获取模板样式
    if (app.globalData.wishTempletCss) {
      d.wishTempletCss = app.globalData.wishTempletCss
    } else {
      me.getWishTempletCss()
    }
    me.setData(d)
    me.initInnerAudioContext()
    me.initInnerVideoContext()
    me.initRecorderManager()
    me.getOpenId(function () {
      me.getWishCards(d.loadDirection, {
        batchSize: 20,
        start: d.leftCardOrder
      })
    })
  },

  initInnerAudioContext() {
    const me = this
    const d = me.data
    d.innerAudioContext = wx.createInnerAudioContext()
    d.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    d.innerAudioContext.onStop(() => {
      console.log('播放完毕')
    })
  },
  initInnerVideoContext() {
    const me = this
    const d = me.data
    d.videoContext = wx.createVideoContext('current-video')
  },

  playVideoCard() {
    const me = this
    const d = me.data

    d.videoContext.requestFullScreen({
      direction: 'vertical'
    })
    d.videoContext.play()
  },

  previewImage(e) {
    const me = this
    const d = me.data
    const imageIndex = parseInt(e.currentTarget.dataset.index)
    const imageSrc = d.bannerList[imageIndex].wishUrl
    wx.previewImage({
      current: imageSrc,
      urls: [imageSrc]
    })
  },

  playAudioCard(e) {
    const me = this
    const d = me.data
    const audioIndex = parseInt(e.currentTarget.dataset.index)
    const audioSrc = d.bannerList[audioIndex].wishUrl
    d.innerAudioContext.src = audioSrc
    d.innerAudioContext.play()
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

/*    if (d.bannerIndex === d.bannerList.length - 7 && (d.start + d.batchSize + 1) < d.cardsNum) {
      d.start += d.batchSize + 1
      me.setData(d)
      me.getWishCards()
    }*/

    if (d.bannerList.length - d.bannerIndex > 3) {
      d.bannerIndex++
      me.setIndex()
    }

    me.setData(d)
  },

  preIndex() {
    const me = this
    const d = me.data
    if(d.bannerIndex > 3){
      d.bannerIndex--
      me.setIndex()
    }
    me.setData(d)
  },

  setIndex(e) {
    console.log(e)
    const me = this
    const d = me.data

    //如果点击自己，return
    // if(d.bannerIndex === e.currentTarget.dataset.index) return
    //设置原来index隐藏
    d.bannerList[d.bannerIndex].isShow = false
    d.bannerList[d.bannerIndex-1].isShow = false
    d.bannerList[d.bannerIndex+1].isShow = false
    try{
      d.bannerIndex = e.currentTarget.dataset.order + 2
      me.setData(d)
    }catch (err){

    }

    //
    /*if (d.bannerIndex <= d.bannerList.length - 8 && (d.start + d.batchSize + 1) < d.cardsNum) {
      d.start += d.batchSize + 1
      me.setData(d)
      me.getWishCards({
        batchSize: d.batchSize,
        start: d.start
      })
    }*/

    if(e!='push') {
      //判断向左预加载
      if(!d.isLeftEnd) {
        if(d.bannerIndex - (d.leftCardOrder + 2) < 5) {
          d.loadDirection = 'left'

          const start = d.leftCardOrder - 1
          me.getWishCards(d.loadDirection, {
            batchSize: -d.batchSize,
            start: start
          })
        }
      }
      //判断向右预加载
      if(d.bannerList.length-d.bannerIndex-3 < 5) {
        d.loadDirection = 'right'

        const start = d.bannerList[d.bannerList.length - 4].order + 1
        me.getWishCards(d.loadDirection, {
          batchSize: d.batchSize,
          start: start
        })
      }

    }else {
    }

    me.setCardVisiable()
    me.setData(d)
  },
  setCardVisiable() {
    const me = this
    const d = me.data
    console.log(d.bannerIndex)
    for(let i = Math.max(d.bannerIndex-3,0); i< d.bannerList.length;i++){

      if(Math.abs(d.bannerIndex - i) <= 1){
        d.bannerList[i].isShow = true
      }else{
        d.bannerList[i].isShow = false
      }
    }
    me.setData(d)
  },

  getWishCards(direction, config) {
    const me = this
    const d = me.data
    const openId = wx.getStorageSync('openId');

    Object.assign(config, {
      openId,
      wishId: d.wishId
    })
    wx.request({
      url: API.getWishCards,
      method: 'POST',
      data: config,
      success: res => {
        const {initiator, wishCards, cardsNum} = res.data
        d.initiator = initiator
        d.cardsNum = cardsNum
        if(wishCards.length !== 0) {
          if(direction === 'left') {
            if(wishCards[0].order === 1) {
              d.isLeftEnd = true
            }
            d.bannerList.splice(wishCards[0].order + 2, wishCards.length, ...wishCards)
            d.leftCardOrder = wishCards[0].order
          } else if(direction === 'right'){
            d.bannerList.splice(-3, 0, ...wishCards)
          } else {
            d.bannerList.splice(wishCards[0].order + 2, d.wishCardOrder-d.leftCardOrder+1, ...wishCards)
            d.leftCardOrder = wishCards[0].order
          }
          d.avators = d.bannerList.slice(0,-3)
          /* d.avators = d.avators.filter((avator) => {
             return avator.owerHeadPic
           })*/
        }
        d.bannerList[d.bannerIndex].isShow = true
        // d.avators = wishCards.length !== 0 ? d.bannerList.slice(0,-3) : d.bannerList.slice(0,3)

        me.setData(d)
      }
    })
  },
  createWish() {
    const me = this
    const d = me.data
    d.showCreatePanel = false
    me.setData(d)
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
  onShareAppMessage() {
    const me = this
    const d = me.data

    const wishCardOrder = d.bannerList[d.bannerIndex].order
    return {
      title: '这个太逗了！快看看！',
      path: '/pages/cardlist/cardlist?wishId='+ d.wishId +'&wishTemplateId=' + d.wishTemplateId + '&wishThemeImgUrl=' + d.wishThemeImgUrl + '&wishCardOrder=' + wishCardOrder,
      imageUrl: '/static/img/wx-share.jpg',
      success() {
        console.log('分享成功')
      },
      fail() {

      },
    }
  },
  ...util.methods,
  ...type.methods
})