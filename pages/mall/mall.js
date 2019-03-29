// pages/mall/mall.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    curPage:1,//页码
    pageSize:10,//每页数
    total:0,
    loading:false,
    giftsList:[],
    goodsList:[], // 礼品列表
    integral:0
  },
  /**
   * 积分兑换 跳转
   */
  handleCreditsExchange(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/mallDetail/malldetail?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 积分明细 跳转
   */
  handleCheckIntegralDetail(){
    wx.navigateTo({
      url: '/pages/integralDetail/detail?'
    })
  },
  /**
   * getGifts 获取商品列表
   */
  getGifts(){
    http.getReq(api.getGifts, { curPage: this.data.curPage, pageSize: this.data.pageSize }, true).then(res => {
      if (res.data.code == 0) {
        const newData = this.data.giftsList.concat(res.data.data.rows);
        this.setData({
          goodsList: newData,
          giftsList: newData,
          total: res.data.data.total, //积分列表
          loading:false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化个人积分
    this.setData({
      integral: app.globalData.relatedInfo.Integral
    })
    this.getGifts();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1,
      giftsList:[]
    });
    this.getGifts();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.curPage >= this.data.total){
      return;
    }
    this.setData({
      loading:true,
      curPage:this.data.curPage + 1
    });
    this.getGifts();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})