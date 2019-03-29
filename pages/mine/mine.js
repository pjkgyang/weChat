// pages/mine/mine.js
const app = getApp();
const http = require('../../utils/http.js');
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curTab: 'jf',
    userInfo: {
      name: 'lwy'
    },
    rankList: [],//排行榜列表
    relatedInfo:{}, // 全局信息
    signInfo:{}, // 签到情况
    actions: [
      {
        name: '确定',
        color: '#2d8cf0',
      }
    ],
    signShow:false, // 签到记录显示
    signShow2:false //签到成功
  },
  // 签到
  handleSign(){
    if (this.data.relatedInfo.IsSign){
      // this.setData({signShow:true})
      return;
    }
      http.postReq(api.signin,{}).then(res=>{
        if(res.data.code == 0){
          if(res.data.state == 'success'){
            app.globalData.relatedInfo.IsSign = true;
            // 初始化信息
            app.getUserInit(function () {
              this.setData({
                signInfo: res.data.data,
                signShow: true,
                relatedInfo: app.globalData.relatedInfo,
              })
            });
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        }
      })
  },
  // 签到记录关闭
  handleClick(){
    this.setData({
      signShow:false,
      signShow2:false
    })
  },
  /**
   * 查看排行榜
   */
  handleCheckRank() {
    wx.navigateTo({
      url: '/pages/rankList/ranklist',
    })
  },
  /**
   * 菜单跳转
   */
  handleRouter(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
  },
  /**
   * 积分榜 问题tab
   */
  handleChangeTab(e) {
    this.setData({
      curTab: e.currentTarget.dataset.tab
    })
    this.getRankList(this.data.curTab);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo,
      relatedInfo: app.globalData.relatedInfo
    });
    this.getRankList(this.data.curTab);
  },
  // 获取积分排名/问题排名
  getRankList(tab){
    http.getReq(tab == 'jf' ? api.integralrank : api.questionrank,{curPage:1,pageSize:3}).then(res=>{
      this.setData({
        rankList: res.data.data.rows
      })
    }).catch(error=>{
        wx.showModal({
          title: '错误',
          content: '网络异常，请稍后再试~',
        })
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }


})