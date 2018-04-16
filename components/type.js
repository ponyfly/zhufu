const util = require('../utils/util')
const API = util.API

module.exports.data = {
  typeId: -1,
  wordContent: '',
  dataUrl: '',
  isAfterWrite: false,
  isStart: true
}

module.exports.methods = {
  hideType() {
    const me = this
    const d = me.data
    d.typeId = -1
    d.wordContent = ''
    d.dataUrl = ''
    me.setData(d)
  },
  setContent(e) {
    const me = this
    const d = me.data
    console.log(e)
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
      wishid: d.wishId,
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

  upLoadTextCard(config) {
    const me = this
    const d = me.data

    config.wishText = d.wordContent
    config.wishType = "text"
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
        me.setData(d)
        //把卡片塞到卡片列表中
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

    wx.showLoading({
      title:'正在生成卡片'
    })
    config.wishType = "img"

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
          me.setData(d)
          //把卡片塞到卡片列表中
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

    wx.showLoading({
      title:'正在生成卡片'
    })
    config.wishType = "voice"

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
          me.setData(d)
          //把卡片塞到卡片列表中
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

    wx.showLoading({
      title:'正在生成卡片'
    })
    config.wishType = "video"

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
          me.setData(d)
          //把卡片塞到卡片列表中
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