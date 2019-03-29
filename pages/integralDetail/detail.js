// pages/integralDetail/detail.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPage:1,
    pageSize:15,
    jfList:[],
    jfArr:[]
  },

  // 获取用户积分流水
  getUserIntegralLogs(){
    let that = this;
    http.getReq(api.userIntegralLogs, { curPage: that.data.curPage,pageSize:that.data.pageSize },true).then(res => {
      if (res.data.code == 0) {
        if (res.data.state == 'success') {
          console.log(res)
          let newData = that.data.jfList.concat(res.data.data.rows);
          that.setData({
            jfList: newData,
            jfArr: newData,
            total:res.data.data.total
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserIntegralLogs();
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
    this.setData({
      curPage:1,
      jfList:[]
    })
    this.getUserIntegralLogs();
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