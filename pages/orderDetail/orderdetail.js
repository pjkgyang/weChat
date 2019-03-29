// pages/orderDetail/orderdetail.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {
      name: 'xxxx',
      phone: '188888888',
      addr: '地球省地市市区',
      sfmr: 1,
      spbh: 'E123456879',
      zt: 1,
      imgurl: 'http://img0.imgtn.bdimg.com/it/u=2373144604,3573823380&fm=26&gp=0.jpg',
      kdmc: '顺丰快递',
      kddh: 'A123456654',
      spjs: '商品介绍',
      jf: '200'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 订单详情
    this.setData({
      orderDetail:JSON.parse(options.item)
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