// pages/columnDetail/columndetail.js
var WxParse = require('../../wxParse/wxParse.js');
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const { $Message } = require('../../dist/base/index');
const myaudio = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    visible:true,
    focus:false,
    commentContent:'',  //输入评论内容
    infoId:'', // 资讯id
    parentId:'', // 回复内容id
    curPage:1,
    pageSize:10,

    total:0,
    information:{
      type:3,
      coverimgUrl:''
    }, //资讯详情
    commentTotal:0,
    commentArr:[], //评论集合
    commentList: [],
    isplay: false,//是否播放
    duration:0,
    currentTime:'',
    totalTime:'',
    curTime:0,
    timer:null
  },
  
  //播放
  play: function () {
    var that = this;
    myaudio.play();
    that.setData({ isplay: true });
    if(that.data.curTime == 0){
      let time = 0;
      that.data.timer = setInterval(()=>{
        time = that.data.curTime + 1;
        that.setData({
          curTime: time
        })
        that.formatTime(time, false);
      },1000)
    }
  },
  // 停止
  stop: function () {
    myaudio.pause();
    this.setData({ isplay: false });
    clearInterval(this.data.timer);
  },


  // 评论(资讯)
  handleComment(){
    this.setData({
      visible:false,
      focus:true,
      parentId:'' 
    })
  },
  // 回复（资讯评论）
  handleReply(e) {
    this.setData({
      parentId: e.currentTarget.dataset.id
    })
  },
  // 回复（他人评论）
  handleReplyComment(e){
    this.setData({
      parentId: e.currentTarget.dataset.id,
      visible: false,
      focus: true,
    })
  },
  // 关闭actionSheet
  actionSheetChange(){
    this.setData({
      visible: true
    })
  },
  // 输入评论内容
  bindKeyInput(e) {
    this.setData({
      commentContent: e.detail.value
    })
  },

  // 提交评论
  handlePutout(){
    var that = this;
    if (!that.data.commentContent){
      $Message({content: '请输入评论内容',type: 'warning'});
      return;
    };
    that.commentInfo();
  },

  // 评论
  commentInfo(parentId){
    var that = this;
    http.postReq(api.commentInfo, { Id: that.data.infoId, Content: that.data.commentContent, ParentId: !!that.data.parentId ? that.data.parentId:''}).then(res => {
      if (res.data.code == 0) {
        if (res.data.state == 'success') {
          that.setData({
            visible: true,
            commentContent: ''
          })
          $Message({content: '评论成功~',type: 'success'});
          that.setData({ commentArr: [], curPage:1});
          that.getComments(that.data.infoId); //获取评论
        }
      }
    })
  },
  // 获取评论列表
  getComments(id){
    var that = this;
    http.getReq(api.getComments, { curPage: that.data.curPage, pageSize: that.data.pageSize,id:id}).then(res=>{
      if(res.data.code == 0){
        if(res.data.state == 'success'){
          let newData = that.data.commentArr.concat(res.data.data.rows);
          // let newData = res.data.data.rows;
          that.setData({
            commentList: newData,
            commentArr: newData,
            commentTotal:res.data.data.records,
            total:res.data.data.total
          })
        }
      }
    })
  },
  

  // 查看更多评论
  handeCheckMoreComment(){
    var that = this;
    if(that.data.curPage > that.data.total){
      return;
    }
    that.setData({
      curPage:that.data.curPage + 1
    })
    that.getComments(that.data.infoId);
  },
  
  // 格式化音频时间
  formatTime(times,isTotal){
    let minute = '';
    let seconds = '';
    if (times % 60 == 0) {
      minute = (times / 60) < 10 ? '0' + (times / 60) :(times / 60);
      seconds = '00';
    } else {
      minute = Math.floor(times / 60) < 10 ? '0' + Math.floor(times / 60) : Math.floor(times / 60);
      seconds = Math.floor(times % 60) < 10 ? '0' + Math.floor(times % 60) : Math.floor(times % 60);
    }
    let resultTime = minute + ':' + seconds;
    if (!!isTotal){
      this.setData({
        duration: resultTime
      })
    }else{
      this.setData({
        currentTime: resultTime
      }) 
    }
  },
  
  // 滑块
  handleSlidering(e){
    var that = this;
    clearInterval(that.data.timer);
    myaudio.seek(e.detail.value);
    that.setData({
      curTime: e.detail.value
    })
    that.formatTime(e.detail.value,false);
  },

  sliderchange(e){
    let that = this;
    let time = e.detail.value;
    that.data.timer = setInterval(()=>{
      time = that.data.curTime + 1
      that.setData({
        curTime: time
      })
      that.formatTime(time, false);
    },1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    if (!!options.input) {
      that.setData({
        focus: true,
        parentId:''
      })
    }
    that.setData({infoId:options.id}); //资讯id
    // 获取资讯详情
    http.getReq(api.getInfo, { id:that.data.infoId},true).then(res=>{
      if(res.data.code == 0){
        if(res.data.state == 'success'){
          that.setData({
            information: res.data.data
          })
          if(res.data.data.Type == 2){
           // wxParse 富文本赋值
            WxParse.wxParse('article', 'html', res.data.data.Content, that, 5);
          } else if (res.data.data.Type == 1){
            that.setData({ isplay: true });
            myaudio.src = res.data.data.Content;
            myaudio.autoplay = true;
            console.log(myaudio.src);
            setTimeout(() => {
              myaudio.onTimeUpdate(() => {
                if(!that.data.totalTime){
                    that.setData({
                      totalTime: Math.floor(myaudio.duration)
                    })
                 }
                that.setData({
                  curTime: Math.floor(myaudio.currentTime)
                })
                that.formatTime(myaudio.duration,true);
                that.formatTime(myaudio.currentTime, false);
              });
            }, 1000);

            myaudio.onEnded(() => {
              clearInterval( that.data.timer );
              that.setData({ isplay: false });
              that.setData({
                currentTime: '',
                curTime:0
              })
            })
          }
        }
      }
    })
    that.getComments(that.data.infoId); //获取评论
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload(){
     myaudio.destroy()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})