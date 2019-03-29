
const app = getApp();

let baseurl = 'http://180.76.150.50/api/weichai/';

let token = '';

/**
 * GET请求
 * URL：接口
 * data:传参
 */
function wxRequestGet(url, data,loadingshow) {
  if (!!loadingshow){
    wx.showLoading({
      title: '加载中...',
    })
  }
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseurl + url,
      data: data,
      method: 'GET',
      header: {
        'Content-type': 'application/json',
        'access_token': wx.getStorageSync('token')
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '401') {
          wx.showModal({
            title: '失败',
            content: '系统超时，请退出小程序重试！',
            showCancel: false
          });
        }
        resolve(res);
      },
      // success: (data) => resolve(data),
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: '失败',
          content: '系统超时，请退出小程序重试！',
          showCancel: false
        });
        reject(err)
      }
    })

  });
  return promise
}

/**
 * POST请求
 * URL：接口
 * data:传参
 */
function wxRequestPost(url, data, loadingshow,accessToken) {
  if (!!loadingshow) {
    wx.showLoading({
      title: '加载中...',
    })
  }
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseurl + url,
      data: data,
      method: 'POST',
      header:{
        "Content-Type":"application/x-www-form-urlencoded",
        "access_token": wx.getStorageSync('token')
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code === '401') {
          wx.showModal({
            title: '失败',
            content: '系统超时，请退出小程序重试！',
            showCancel: false
          });
        }
        resolve(res);
      },
      // success: (data) => resolve(data),
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: '失败',
          content: '系统超时，请退出小程序重试！',
          showCancel: false
        });
        reject(err)
      }
    })

  });
  return promise
}


module.exports = {
  postReq: wxRequestPost,
  getReq: wxRequestGet,
}
