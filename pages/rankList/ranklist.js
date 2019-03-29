// pages/rankList/ranklist.js
const http = require('../../utils/http.js');
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curTab: 'jf',
    pageSize:20,
    jfPage:1,
    dtPage:1,
    jfTotal:0, //积分总页数
    dtTotal:0, //答题总页数
    rankList:[],
    integralRankList: [], //积分榜单
    answerRankList:[], //答题榜单
    scrollTop:0,
    loading:false
  },
  // 切换积分榜/问题榜
  handleChangeTab(e) {
    this.setData({
      curTab: e.currentTarget.dataset.tab
    })
    console.log(this.data.curTab == 'dt' && !this.data.answerRankList.length)
    if (this.data.curTab == 'jf' && !this.data.integralRankList.length){
        this.getRankList('jf');
      }else{
        this.setData({rankList:this.data.integralRankList})
      }
    if (this.data.curTab == 'dt' && !this.data.answerRankList.length){
        this.getRankList('dt');
      }else{
        this.setData({ rankList: this.data.answerRankList })
      }
  },

  scroll(){},
  // 下拉加载
  loadMore(e){
    if (this.data.curTab == 'jf' && this.data.jfPage >= this.data.jfTotal && 5 >= this.data.jfPage){
      return;
    }
    if (this.data.curTab == 'dt' && this.data.dtPage >= this.data.dtTotal && 5 >= this.data.dtTotal){
      return;
    }
    if(this.data.curTab == 'jf'){
      this.setData({ jfPage: this.data.jfPage + 1 });
    }else{
      this.setData({ dtPage: this.data.dtPage + 1 });
    }
    this.setData({loading:true});  //加载loading
    this.getRankList(this.data.curTab);
  },

  // 获取积分排名/问题排名
  getRankList(tab) {
    http.getReq(tab == 'jf' ? api.integralrank : api.questionrank, { curPage: tab == 'jf' ? this.data.jfPage : this.data.dtPage, pageSize: this.data.pageSize }, (tab == 'jf' && this.data.jfPage == 1) || (tab == 'dt'&&this.data.dtPage==1)).then(res => {
      if(tab == 'jf'){
        const newData = this.data.integralRankList.concat(res.data.data.rows);
        this.setData({
          rankList: newData,
          integralRankList: newData,
          jfTotal: res.data.data.total //积分列表
        })
        
      }else{
        const newData2 = this.data.answerRankList.concat(res.data.data.rows);
        this.setData({
          rankList: newData2,
          answerRankList: newData2,
          dtTotal: res.data.data.total // 问题列表
        }) 
      }
      this.setData({ loading: false }) //关闭加载loading
    }).catch(error => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankList(this.data.curTab); 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
       jfPage: 1 ,
       dtPage: 1 ,
    });
    if(this.data.curTab == 'jf'){
      this.setData({
        integralRankList: []
      })
    }else{
      this.setData({
        answerRankList: []
      })
    }
    this.getRankList(this.data.curTab); 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})