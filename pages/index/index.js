// pages/index/index.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hideAuth: false,
    scene:''
  },
         
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorage({key: 'userinfo',data: e.detail.userInfo})
      wx.login({
        success: function (res) {
          http.postReq(api.userlogin, { code: res.code, source: app.globalData.scene }).then(res=>{
            if(res.data.code == 0){
              if(res.data.state == 'success'){
                wx.setStorage({ key: 'authHide', data: true });
                wx.setStorage({ key: 'token', data: res.data.data.Access_token });
               
                http.postReq(api.update, {
                  UserName: e.detail.userInfo.nickName,
                  Gender: e.detail.userInfo.gender,
                  Avatar: e.detail.userInfo.avatarUrl,
                  Country: e.detail.userInfo.country,
                  Province: e.detail.userInfo.province,
                  City: e.detail.userInfo.city
                }, false, wx.getStorageSync('token')).then(res => {
                  if (res.data.code == 0) {
                    if(res.data.state == 'success'){
                      app.globalData.isAuth = true;
                      // wx.switchTab({
                      //   url: '/pages/home/home?scene='+that.data.scene
                      // })
                      wx.reLaunch({
                        url: '/pages/home/home?scene=' + that.data.scene
                      })
                    }
                  }
                })
              }
            }
           
        }).catch(error=>{
          wx.showModal({
            title: '失败',
            content: '授权超时，请稍后再试~',
          })
        })
    }
  })
    
      //授权成功后，跳转进入小程序首页
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scene: !!options.scene ? options.scene:''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})