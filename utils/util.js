
const qiniu = require('./qiniu')

const api = {
  getOpenId: 'https://pisces.j.cn/api/CommonFetchOpenIdByJSCode',
  getWishTemplets: 'https://pisces.j.cn/api/getWishTemplets',
  getWishTempletCss: 'https://pisces.j.cn/api/getWishTempletCss',
  getWishCards: 'https://pisces.j.cn/api/getWishCards',
  getMyWishes: 'https://pisces.j.cn/api/getMyWishes',
  buildWish: 'https://pisces.j.cn/api/buildWish',
  buildCard: 'https://pisces.j.cn/api/buildCard',
  getUploadInfo: 'https://piscestest.j.cn/api/getUploadInfo'
}
const apitest = {
  getOpenId: 'https://piscestest.j.cn/api/CommonFetchOpenIdByJSCode',
  getWishTemplets: 'https://piscestest.j.cn/api/getWishTemplets',
  getWishTempletCss: 'https://piscestest.j.cn/api/getWishTempletCss',
  getWishCards: 'https://piscestest.j.cn/api/getWishCards',
  getMyWishes: 'https://piscestest.j.cn/api/getMyWishes',
  buildWish: 'https://piscestest.j.cn/api/buildWish',
  buildCard: 'https://piscestest.j.cn/api/buildCard',
  getUploadInfo: 'https://piscestest.j.cn/api/getUploadInfo'
}

const API = apitest

function getOpenId(callback) {
  const openId = wx.getStorageSync('openId');
  if (openId) {
    //commit('setOpenId', openId)
    callback && callback()
  } else {
    wx.login({
      success: function (res) {
        const code = res.code
        wx.request({
          url: API.getOpenId,
          method: 'POST',
          data: {
            appId: 'wx6b61571b20b0c664',
            jsCode: code
          },
          success: res => {
            //commit('setOpenId', res.data.openId)
            wx.setStorageSync('openId', res.data.openId)
            callback && callback()
          }
        })
      }
    })
  }
}

// function getUserInfo(callback) {
//   wx.getUserInfo({
//     success: (res) => {
//       wx.setStorageSync('userInfo', {
//         avatarUrl: res.userInfo.avatarUrl,
//         nickName: res.userInfo.nickName
//       })
//       callback && callback()
//     },
//     fail() {
//       console.log(11)
//     }
//   })
// }

function getUserInfo(cb) {
  const me = this
  const d = me
  let userInfo = {}
  try {
    userInfo = wx.getStorageSync('userInfo')
  } catch (e) {
    console.log('本地没存', e)
  }
  if (userInfo) {
    cb && cb(userInfo)
    return
  }
  wx.getUserInfo({
    success(data) {
      userInfo = data.userInfo
      wx.setStorageSync('userInfo', userInfo)
      cb && cb(userInfo)
    },
    fail() {
      d.isAuthAllow = false
      me.setData(d)
    }
  })
}
function fileUpload(filePath, data, succ, err) {
  //支服务器拿token,成功后开始七牛上传
  wx.showLoading({
    title: '上传中',
    mask: true,
  })

  let isTimeout = false
  let uploadTimeout = setTimeout(function() {
    isTimeout = true
    wx.hideLoading()
    wx.showToast({
      title: '上传超时',
      mask: true,
    })
  }, 30000)

  wx.request({
    url: API.getUploadInfo,
    method: 'POST',
    data: data,
    success: function(jsonToken) {
      qiniu.upload(filePath, function(qiniuRes) {
        clearTimeout(uploadTimeout)
        if (isTimeout) {
          console.log('虽然上传成功了，但是超时了，不做后续操作')
          return
        }
        wx.hideLoading()
        succ({
          resUrl: jsonToken.data.uploadInfoList[0].finalUrl,
          status: qiniuRes
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }, function(error) {
        err(error)
      }, {
        region: 'ECN',
        key: jsonToken.data.uploadInfoList[0].key,
        uptoken: jsonToken.data.uploadInfoList[0].token,
      })
    },
    fail() {
      err()
      console.log('获取token信息失败')
    }
  })
}


module.exports.methods = {
  getOpenId,
  getUserInfo,
  fileUpload
}
module.exports.API = API
