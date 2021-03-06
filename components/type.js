const util = require('../utils/util')
const API = util.API

module.exports.data = {
  typeId: -1,
  wordContent: '',
  dataUrl: '',
  isAfterWrite: false,
  isStart: true,
  newCard: {}
}

module.exports.methods = {
  hideType() {
    const me = this
    const d = me.data
    d.typeId = -1
    d.wordContent = ''
    d.dataUrl = ''
    d.isAfterWrite = false
    d.isStart = true
    me.setData(d)
  },
  setContent(e) {
    const me = this
    const d = me.data
    d.wordContent = e.detail.value
    if(d.wordContent) {
      d.isAfterWrite = true
    }
    me.setData(d)
  },
  uploadCard() {
    const me = this
    const d = me.data
    const userInfo = wx.getStorageSync('userInfo')
    let config = {
      openId: wx.getStorageSync('openId'),
      owerHeadPic: userInfo.avatarUrl,
      ownerName: userInfo.nickName,
      wishTemplateId: d.wishTemplateId,
      wishId: d.wishId,
      wishCardBg: '',
      wishText: '',
      wishType: '',
      wishUrl: '',
    }

    switch (d.typeId) {
      case "1":
        me.upLoadTextCard(config)
        break;
      case "2":
        me.upLoadAudioCard(config)
        break;
      case "3":
        me.upLoadVideoCard(config)
        break;
      case "4":
        me.upLoadImageCard(config)
        break;
      default:
        console.log('err')
    }

    me.setData(d)
  },

  pushCardToList(res) {
    const me = this
    const d = me.data
    console.log(res)
    const userInfo = wx.getStorageSync('userInfo');
    res.data.owerHeadPic = userInfo.avatarUrl
    res.data.ownerName = userInfo.nickName
    res.data.isShow = true
    if(d.avators.length === 0) {
      d.bannerList.splice(-4,1,res.data)
    } else {
      d.bannerList.splice(-3,0,res.data)
    }

    d.avators.push({
      owerHeadPic:userInfo.avatarUrl,
      ownerName:userInfo.nickName
    })

    d.bannerIndex = d.avators.length -1 + 3

    me.setData(d)
    me.setIndex('push')

  },

  upLoadTextCard(config) {
    const me = this
    const d = me.data

    if(!d.wordContent) {
      wx.showToast({
        title: '请填写祝福语'
      })
      return
    }

    config.wishText = d.wordContent
    config.wishType = "text"
    config.wishCardBg = d.wishTempletCss.step3.bgText
    wx.showLoading({
      title:'正在生成卡片'
    })

    wx.request({
      url: API.buildCard,
      method: 'POST',
      data: config,
      success: res => {
        console.log(res)
        d.isAfterWrite = false
        d.typeId = -1
        d.showCreatePanel = false
        d.wordContent = ''
        d.dataUrl = ''
        //把卡片塞到卡片列表中
        d.newCard = res.data
        me.pushCardToList(res)

        console.log(d.newCard)
        me.setData(d)
      },
      complete: () =>{
        wx.hideLoading()
      }
    })
    me.setData(d)
  },

  upLoadImageCard(config) {
    const me = this
    const d = me.data

    if(!d.dataUrl) {
      wx.showToast({
        title: '请选择图片'
      })
      return
    }

    wx.showLoading({
      title:'正在生成卡片'
    })
    config.wishType = "img"
    config.wishCardBg = d.wishTempletCss.step3.bgImage

    me.fileUpload(d.dataUrl, {
      keys: '',
      mimeType: 'image',
      suffixes: 'png,jpg,jpeg'
    }, function (res) {
      console.log(res)
      config.wishUrl = res.resUrl
      wx.request({
        url: API.buildCard,
        method: 'POST',
        data: config,
        success: res => {
          console.log(res)
          d.isAfterWrite = false
          d.typeId = -1
          d.showCreatePanel = false
          d.dataUrl = ''
          //把卡片塞到卡片列表中
          d.newCard = res.data
          me.pushCardToList(res)
          me.setData(d)
        },
        complete: () =>{
          wx.hideLoading()
        }
      })
    }, function () {
      console.log('err')
    })


    me.setData(d)
  },

  upLoadAudioCard(config) {

    const me = this
    const d = me.data

    if(!d.dataUrl) {
      wx.showToast({
        title: '请录音'
      })
      return
    }

    wx.showLoading({
      title:'正在生成卡片'
    })
    config.wishType = "voice"
    config.wishCardBg = d.wishTempletCss.step3.bgAudio

    me.fileUpload(d.dataUrl, {
      keys: '',
      mimeType: 'audio',
      suffixes: 'mp3'
    }, function (res) {
      console.log(res)
      config.wishUrl = res.resUrl
      wx.request({
        url: API.buildCard,
        method: 'POST',
        data: config,
        success: res => {
          console.log(res)
          d.isAfterWrite = false
          d.typeId = -1
          d.showCreatePanel = false
          d.dataUrl = ''
          //把卡片塞到卡片列表中
          d.newCard = res.data
          me.pushCardToList(res)
          me.setData(d)
        },
        complete: () =>{
          wx.hideLoading()
        }
      })
    }, function () {
      console.log('err')
    })
    me.setData(d)
  },

  upLoadVideoCard(config) {
    const me = this
    const d = me.data

    if(!d.dataUrl) {
      wx.showToast({
        title: '请选择视频'
      })
      return
    }

    wx.showLoading({
      title:'正在生成卡片'
    })
    config.wishType = "video"
    config.wishCardBg = d.wishTempletCss.step3.bgVideo

    me.fileUpload(d.dataUrl, {
      keys: '',
      mimeType: 'pitchVideo',
      suffixes: 'mp4'
    }, function (res) {
      console.log(res)
      config.wishUrl = res.resUrl
      console.log(config)
      wx.request({
        url: API.buildCard,
        method: 'POST',
        data: config,
        success: res => {
          console.log(res)
          d.isAfterWrite = false
          d.typeId = -1
          d.showCreatePanel = false
          d.dataUrl = ''
          //把卡片塞到卡片列表中
          d.newCard = res.data
          me.pushCardToList(res)
          me.setData(d)
        },
        complete: () =>{
          wx.hideLoading()
        }
      })
    }, function () {
      console.log('err')
    })
    me.setData(d)
  },

  chooseImage() {
    const me = this
    const d = me.data

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        d.dataUrl = res.tempFilePaths[0]
        d.isAfterWrite = true
        me.setData(d)
      }
    })
    me.setData(d)
  },

  chooseVideo() {
    const me = this
    const d = me.data

    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: ['front','back'],
      success: function (res) {
        d.dataUrl = res.tempFilePath
        d.isAfterWrite = true
        me.setData(d)
      }
    })
    me.setData(d)
  },

  startRecord() {
    const me = this
    const d = me.data
    d.recorderManager.start({format: 'mp3'})
  },

  stopRecord() {
    const me = this
    const d = me.data
    d.recorderManager.stop()
  },

  reRecord() {
    const me = this
    const d = me.data
    d.isStart = true
    d.isAfterWrite = false
    me.setData(d)
    d.innerAudioContext.stop()
  },

  tryListen() {
    const me = this
    const d = me.data
    d.innerAudioContext.src = d.dataUrl
    me.setData(d)
    d.innerAudioContext.play()
  },

  xxxxxxxxxxxxxx() {
    const me = this
    const d = me.data
    me.setData(d)
  }
}