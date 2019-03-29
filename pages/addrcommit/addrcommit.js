// pages/addrcommit/addrcommit.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},    // 当前选择地址
    giftDetail: {}, // 商品详情
  },
  // 选择地址列表
  handleChooseAddress(event) {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.giftDetail)
    // 商品详情
    this.setData({
      giftDetail: app.globalData.giftDetail
    })

    if (!app.globalData.address) {
      // 获取默认地址
      http.getReq(api.getDefaultAddr, {}, true).then(res => {
        if (res.data.code == 0) {
          this.setData({
            address: !!res.data.data ? res.data.data : null,
          })

          app.globalData.address = res.data.data
        }
      })
    }
  },
  // 提交兑换订单
  handleCommit() {
    http.postReq(
      api.exchangeGift,
      { commodityId: this.data.giftDetail.Id, addrId: this.data.address.Id }, true).then(res => {
        if (res.data.code == 0) {
          if (res.data.state == 'success') {

            // 初始化用户信息
            app.getUserInit(function () {
              $Message({ content: '兑换成功~', type: 'success' });
              // 返回商品列表页面
              wx.switchTab({
                url: '/pages/mall/mall'
              })
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
            })
          }
        }
      })
  },
  // 选择地址
  handleChooseAddr() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 当前选择地址
    this.setData({
      address: app.globalData.address
    })
  },
})