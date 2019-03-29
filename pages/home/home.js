//index.js
//获取应用实例
const app = getApp();
const api = require("../../utils/api.js");
const http = require("../../utils/http.js"); //require引入

Page({
  data: {
    banners: [],
    sorts: [],
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 1000,
    userInfo: {},
    hasUserInfo: false,
    swiperCurrent: 0, //当前初始banner
    answerFrequency:0, // 答题次数
  },


  onLoad: function (options) {
    var that = this;
    if (!!options.scene && !!wx.getStorageSync('authHide')){
      wx.navigateTo({
        url: '/pages/columnDetail/columndetail?id=' + options.scene
      })
    }
    if (!wx.getStorageSync('authHide')) {
      let url = !!options.scene ? '/pages/index/index?scene=' + options.scene : '/pages/index/index'
      wx.redirectTo({
        url: url
      })
    }else{
      //  获取banner
      http.getReq(api.getBanners, {}).then(res => {
        if (res.data.code == 0) {
          if (res.data.state == 'success') {
            that.setData({
              banners: res.data.data
            })
          } else {
            wx.showModal({ title: '提示', content: res.msg })
          }
        }
      }).catch(error => { })
      // 获取学院
      http.getReq(api.getSchools, {}).then(res => {
        if (res.data.code == 0) {
          if (res.data.state == 'success') {
            that.setData({
              sorts: res.data.data
            })
          } else {
            wx.showModal({ title: '提示', content: res.msg })
          }
        }
      }).catch(error => { });

      if (app.globalData.relatedInfo.AnswerFrequency != undefined) {
        that.setData({
          answerFrequency: app.globalData.relatedInfo.AnswerFrequency
        })
      }

      if (!!that.data.answerFrequency) {
        that.showModal();
      } else {
        http.getReq(api.getLoginUser, {
          access_token: wx.getStorageSync('token')
        }).then(res => {
          if (res.data.code == 0) {
            if (res.data.state == 'success') {
              that.setData({
                answerFrequency: res.data.data.AnswerFrequency
              })
              wx.setStorage({ key: 'token', data: res.data.data.Access_token });
              if (!!res.data.data.AnswerFrequency) {
                that.showModal();
              }
            }
          }
        })
      }
    }
  },
  
  showModal(){
    wx.showModal({
      title: '答题得好礼',
      content: '今天您还有' + this.data.answerFrequency + '次答题机会哦~',
      cancelText: "朕无心情",
      confirmText: '去答题',
      confirmColor: '#2d8cf0',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/interlocuteBegin/interlocutebegin',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  // 分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '潍柴动力学院',
      path: '/pages/home/home'
    }
  },
  // swiper 切换
  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // // swiper 点击
  // swiperClick(e) {
  //   console.log(e.currentTarget.dataset.id);
  // },
  // 分类跳转
  handleToDetail(e) {
    wx.navigateTo({
      url: '/pages/column/column?schoolId=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name
    })
  },
})