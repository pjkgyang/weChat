// pages/task/task.js
const http = require('../../utils/http.js');
const api = require('../../utils/api.js');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskListArr:[],
    taskList: [{
      imgurl: 'http://img0.imgtn.bdimg.com/it/u=2373144604,3573823380&fm=26&gp=0.jpg',
      rwmc: '登录',
      jf: 2,
      id: 1,
      zy: "每日首次登录",
      state: 1,
    }, {
      imgurl: 'http://img0.imgtn.bdimg.com/it/u=2373144604,3573823380&fm=26&gp=0.jpg',
      rwmc: '签到',
      jf: 2,
      id: 2,
      zy: '每日签到',
      state: 2,
    }, {
      imgurl: 'http://img0.imgtn.bdimg.com/it/u=2373144604,3573823380&fm=26&gp=0.jpg',
      rwmc: '分享',
      jf: 4,
      id: 2,
      zy: '向3个不同好友分享小程序',
      state: 0,
    }],
    moreLoading:false,
    curPage:1,
    pageSize:15,
    total:0
  },

  // handleCheckDetail(e) {
  //   console.log(e)
  //   wx.navigateTo({
  //     url: '/pages/taskDetail/taskdetail?id=1',
  //   })
  // },

  /**
   * 获取任务列表
   */
  getTask(fresh){
    var that = this;
    http.getReq(api.getTask, { curPage: that.data.curPage, pageSize: that.data.pageSize, isCompleted: '' }, that.data.curPage == 1 && !fresh).then(res => {
      if (res.data.code == 0) {
        if (res.data.state == 'success') {
          let newData = that.data.taskListArr.concat(res.data.data.rows);
          that.setData({
            taskList: newData,
            taskListArr: newData,
            total: res.data.data.total,
            moreLoading:false
          })
          if (fresh){
            $Message({
              content: '刷新成功~',
              type: 'success'
            });
            wx.stopPullDownRefresh();
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTask();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      curPage: 1,
      taskListArr:[]
    })
    that.getTask(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if(that.data.curPage >= that.data.total){
      return;
    }
    that.setData({
      curPage:that.data.curPage + 1,
      moreLoading:true
    })
    that.getTask();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})