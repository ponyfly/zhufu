const util = require('../utils/util')
const API = util.API

module.exports.data = {
  typeId: -1,
  wordContent: '',
  imgUrl: ''
}

module.exports.methods = {
  hideType() {
    const me = this
    const d = me.data
    d.typeId = -1
    me.setData(d)
  },
  setContent(e) {
    const me = this
    const d = me.data
    console.log(e)
    d.wordContent = e.detail.value
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
      wishTemplateId: d.templateId,
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
    config.wishUrl = ""


    wx.request({
      url: API.buildCard,
      method: 'POST',
      data: config,
      success: res => {
        console.log(res)
        //把卡片塞到卡片列表中
      },
      complete: () =>{
        wx.hideLoading()
      }
    })

    me.setData(d)
  },

  upLoadAudioCard(config) {
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
        //把卡片塞到卡片列表中
      },
      complete: () =>{
        wx.hideLoading()
      }
    })

    me.setData(d)
  },

  upLoadVideoCard(config) {
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
        //把卡片塞到卡片列表中
      },
      complete: () =>{
        wx.hideLoading()
      }
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
        d.imgUrl = res.tempFilePaths

        me.fileUpload(d.imgUrl, {
          keys: '',
          mimeType: 'image',
          suffixes: 'png,jpg,jpeg'
        }, function(res) {
          console.log(res)
        }, function () {
          console.log('err')
        })

      }
    })

    me.setData(d)
  },
  xxxxxxxxxxxxxx() {
    const me = this
    const d = me.data
    me.setData(d)
  }
}