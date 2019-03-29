// pages/interlocution/interlocution.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0, // 
    curNum: 1, // 当前题序号
    complete: false, //是否答题完成
    answer: [], //答案集合

    questionData: {}, //问题集合
    questionArr: [],
    completeResult:{}, //完成结果统计
    resultId: '', // 当前选择答案id
    questionId: '', //当前问题id
    timer: '', // 定时器
    countDown: 10, // 倒计时
    nextSecond: 3, // 倒计时下一题秒数
    curResult: false, // 当前回答结果显示
    answerSuccess: true, // 是否回答正确
    answerFrequency: 0, // 可答题次数
    visible:false,
    actions: [
      {
        name: '去填写',
        color: '#2d8cf0',
      },
      {
        name: '再想想'
      }
    ],
  },

  handleClick({ detail }){
    const index = detail.index;
    if (index === 0) {
    wx.navigateTo({
      url: 'pages/address/address',
    })
    } else if (index === 1) {
      this.setData({
        visible: false
      });
    }
  },
  // 选择答案
  handleChooseAnswer(e) {
    let that = this;
    let zqda = e.currentTarget.dataset.zqda, //正确答案
      answerArr = this.data.answer,
      daan = e.target.dataset.daan, // 当前选择答案
      ind = e.target.dataset.ind, //当前索引
      items = e.target.dataset.item;

    if (!answerArr[ind]) { // 不能多次点击
      answerArr[ind] = daan;
      this.setData({
        answer: answerArr
      }); //答案列表

      Object.keys(items.option).forEach(function(key) {
        if (key.length == 3 && key.includes(daan)) {
          console.log(key, items.option[key]);
          that.setData({
            resultId: items.option[key], //当前选择答案 id
          })
        }
      });

      // 结果也显示
      this.setData({
        curResult: true
      });

      // 是否回答正确 提示
      if (zqda == daan) {
        this.setData({
          answerSuccess: true
        });
      } else {
        this.setData({
          answerSuccess: false
        });
      }
      that.submitAnswer(); //提交答案
      clearInterval(that.timer); // 清除总定时器
      that.nextAnswerTimer(); // 开始倒计时（3s）
    }
  },

  // 继续答题
  handleGoonAnswer() {
    this.setData({
      complete: false,
      current: 0
    })
    if (this.data.answerFrequency > 0){
      this.getUserTestPaper();
    }
  },

  /**
   * 获取剩余答题次数
   */
  getUserAnswerFrequency() {
    http.getReq(api.getUserAnswerFrequency, {}, true).then(res => {
      if (res.data.code == 0) {
        if (res.data.state == 'success') {
          this.setData({
            answerFrequency: res.data.data
          })
          app.globalData.relatedInfo.AnswerFrequency = res.data.data;

        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },
  // 获取题目列表
  getUserTestPaper() {
    let that = this;
    http.getReq(api.getUserTestPaper, {}, true).then(res => {
      if (res.data.code == 0) {
        if (res.data.state == 'success') {
          that.setData({
            current: 0, //当前题位置
            answer: [], //清空答案列表
            questionData: res.data.data,
            curNum: res.data.data.Questions[0].OrderNum, //题目数
            questionId: res.data.data.Questions[0].QuestionId
          })
          that.totalCountDown();
        }
      }
    })
  },
  // 提交答案
  submitAnswer() {
    let that = this;
    http.postReq(api.submitAnswer, {
      TestPaperId: that.data.questionData.Id, // 试卷id
      QuestionId: that.data.questionId, // 问题id
      AnswerId: that.data.resultId // 答案id
    }).then(res => {
      if (res.data.code == 0) {
        if (res.data.state == 'success') {
          that.setData({
            completeResult:res.data.data
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },
  // 总倒计时
  totalCountDown() {
    let that = this;
    let answerArr = that.data.answer;
    that.timer = setInterval(() => {
      that.setData({
        countDown: that.data.countDown - 1
      })
      if (that.data.countDown <= 0) {
        this.setData({
          curResult: true,
          answerSuccess: false
        }); //回答错误
        answerArr[that.data.current] = that.data.questionData.Questions[that.data.current].daan;
        that.setData({
          answer: answerArr, //设置答案
          resultId: '', //当前未作答 答案为空

        })
        if(that.data.answerFrequency > 0 ){
          that.submitAnswer();
          that.nextAnswerTimer(); //倒计时 进入下一题
        }
        clearInterval(that.timer);
      }
    }, 1000)
  },

  // 下一题倒计时
  nextAnswerTimer() {
    let that = this;
    var timer = setInterval(function() {
      that.setData({
        nextSecond: that.data.nextSecond - 1
      })
      if (that.data.nextSecond <= 0) {
        that.setData({
          current: that.data.current + 1,
          curResult: false, //隐藏上一题结果提示
        });

        // 答题完成
        if (that.data.current+1 > that.data.questionData.Questions.length) {
          that.setData({
            complete: true,
          });
          if (!app.globalData.relatedInfo.HasAddress){
            that.setData({
              visible: true
            });
          }
        } else {
          that.setData({
            curNum: that.data.questionData.Questions[that.data.current].OrderNum, //获取题序号
            questionId: that.data.questionData.Questions[that.data.current].QuestionId //获取问题id
          })
          that.getUserAnswerFrequency(); // 获取答题次数
          that.totalCountDown(); //总倒计时
        }
        that.setData({
          nextSecond: 3, //下一题倒计时 重置
          countDown: 10 //总倒计时 重置
        });
        clearInterval(timer);
      }
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取答题次数
    this.getUserAnswerFrequency();
    // 获取题目数
    this.getUserTestPaper();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})