// pages/mallDetail/malldetail.js
var WxParse = require('../../wxParse/wxParse.js');
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tab切换  
    current: 0,
    giftDetail:{},
    bannerList: ['//img.alicdn.com/imgextra/i1/1992002180/O1CN011RyTsyjZHo5ksdI_!!0-item_pic.jpg_1152x1920Q50s50.jpg',
    '//img.alicdn.com/imgextra/i4/1992002180/O1CN011RyTt0O3iyhlT2W_!!1992002180.jpg_1152x1920Q50s50.jpg'],
    nodes: '<blockquote>测试的哦</blockquote><p><span style="font-size: x-large;"><img src="http://qdnewshopping.shop/7a84988e-c254-43cc-953a-5bdc8c7839f2.png" style="max-width:100%;"></span><br></p>'
  },
  /**
   * swiper 切换
   */
  bindChange: function (e) {
    var that = this;
    that.setData({
      current: e.detail.current
    });
  },
  handleCommit(){
    // const detail = {
    //     Id:this.data.giftDetail.Id,
    //     Title: this.data.giftDetail.Title,
    //     Integral: this.data.giftDetail.Integral,
    //      CoverImgUrl: this.data.giftDetail.CoverImgUrl, //封面图
    // }
    app.globalData.giftDetail = this.data.giftDetail;
    app.globalData.address = '';//清空地址
    wx.navigateTo({
      url: '/pages/addrcommit/addrcommit?gift=1'
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取礼品详情
    http.getReq(api.getGift, { id: options.id},true).then(res=>{
      if(res.data.code == 0){
        console.log(res)
        that.setData({
          giftDetail: res.data.data
        })
        if (!!res.data.data.ImgUrl){
          that.setData({
            bannerList: res.data.data.ImgUrl.split(',')
          }) 
        }
        WxParse.wxParse('article', 'html', res.data.data.Content, that, 5); 
      }
    })

    // wxParse 富文本赋值
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})