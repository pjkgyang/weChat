// pages/order/order.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const { $Message } = require('../../dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    curPage: 1,
    total: 0,
    loading:false,//加载中
    refresh:false,//下拉刷新
    orderOList:[],//记录订单列表
    orderList:[]
  },

  /**
   * 查看订单详情
   */
  handleCheckOrderDetail(e){
    wx.navigateTo({
      url: '/pages/orderDetail/orderdetail?item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  },
  // 获取兑换记录
  getExchangeLogs(){
    http.getReq(api.exchangeLogs, { curPage: this.data.curPage, pageSize: 10 }, this.data.curPage == 1).then(res => {
      if (res.data.code == 0) {
        if (res.data.state == 'success') {
          if (this.data.refresh){
            $Message({
              content: '数据刷新成功~',
              type: 'success'
            });
          }
          var orderData = this.data.orderOList.concat(res.data.data.rows);
          this.setData({
            orderList: orderData,
            orderOList: orderData,
            total:res.data.data.total,
            loading:false, //加载完成
            refresh:false
          })
          wx.stopPullDownRefresh()
        }else{
          wx.showModal({
            title: '提示',
            content:res.data.msg,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取兑换记录
    this.getExchangeLogs();
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1,
      orderOList:[],
      refresh:true
    })
    this.getExchangeLogs();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.curPage >= this.data.total){
      return;
    }
    this.setData({
      curPage:this.data.curPage + 1,
      loading:true
    })
    thisgetExchangeLogs();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})