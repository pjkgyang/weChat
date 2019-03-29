// pages/column.js
const utils = require('../../utils/util.js');
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
const { $Message } = require('../../dist/base/index');
const TxvContext = requirePlugin("tencentvideo"); 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    translateScroll:0, // 滚动距离 
    translateFresh:0, // 下拉刷新文字距离
    height: 0, // scroll-wrap 的高度，这个高度是固定的
    inner_height: 0, // inner-wrap 的高度，这个高度是动态的
    start_scroll: 0, // 滚动前的位置。
    touch_down: 0, // 触摸时候的 Y 的位置
    touch_end: 0,
    moreLoading: false, //上拉加载 显示
    freshLoading:false, // 下拉刷新 加载 显示
    scrollTop: 0, //滚动距离
    newScroll: 0,
    imgtextScroll: 0,
    videoScroll: 0,
    audioScroll: 0,


    // tab切换  
    current: "", // 当前tab
    videoPlay: null,
    pageSize:10, 
    newPage:1, // 最新当前页
    imgTextPage: 1, // 图文当前页
    videoPage: 1, // 视频当前页
    audioPage: 1, // 音频当前页
    newTotal:0,   // 最新总页数
    imgTextTotal: 0,// 图文总页数
    videoTotal: 0,// 视频总页数
    audioTotal: 0,// 音频总页数
    schoolId:0,  // 学院id

    newArr:[], //存储下拉最新列表
    imgTextArr: [],//存储图文最新列表
    videoArr: [],//存储视频最新列表
    audioArr: [],//存储音频最新列表

    newArrList: [],
    imgTextList: [],
    videoList: [],
    audioList: [],
    dataList: [],
   

    // 海报
    sharebg: 'http://qiniu.jnwtv.com/H520181206092255188568494.png', // 分享底部背景图
    shareTitle: '', // 分享标题
    shareCoverImg: '', // 分享封面图
    shareQrImg: '', // 分享小程序二维码
    userInfo: {},
    seeDate: utils.formatTime(new Date()), //看视频日期
    show: false,//海报显示
    isSaveImg:false,//是否已保存相册
    ewmurl: '',
    imgurl: '',
    coverimgUrl:'',//转发封面图


    audioId:'', //音频id
    playerid: ''//txvid

  },

  // 点击cover播放，其它视频结束
  videoPlay: function(e) {
    var _index = e.currentTarget.dataset.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(_index + "")
    videoContextPrev.stop();

    setTimeout(function() {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index + "");
      videoContext.play();
    }, 200)
    
    // 暂停音频
    var audioCtx = wx.createAudioContext(this.data.audioId);
    audioCtx.pause();
    // 暂停txv
    if (!!that.data.playerid){
      var txvContext = TxvContext.getTxvContext(that.data.playerid);
      txvContext.pause();
    }
  },
  handlePlayTxv(e){
    var that = this;
    // 停止播放视频
    that.setData({
      _index: null,
      playerid: e.currentTarget.dataset.playerid
    });
    var audioCtx = wx.createAudioContext(this.data.audioId);
    audioCtx.pause();
  },
  
  // 音频播放
  handlePlayAudio(e){
    var that = this;
    var audioCtx = wx.createAudioContext(that.data.audioId);
    audioCtx.pause();

    // 停止播放视频
    that.setData({
      _index: null,
      audioId: e.currentTarget.dataset.ite
    });

    
    // 暂停txv
    if (!!that.data.playerid) {
      var txvContext = TxvContext.getTxvContext(that.data.playerid);
      txvContext.pause();
    }
  },

  /**
   * 滚动监听
   */
  columnScroll(e) {
    if (e.detail.scrollTop > 0) {
      this.setData({
        freshLoading: false,
      })
    }
    this.setData({
      scrollSticky: e.detail.scrollTop
    });
    switch (this.data.current) {
      case "":
        this.setData({
          newScroll: e.detail.scrollTop
        });
        break;
      case "2":
        this.setData({
          imgtextScroll: e.detail.scrollTop
        });
        break;
      case "0":
        this.setData({
          videoScroll: e.detail.scrollTop
        });
        break;
      case "1":
        this.setData({
          audioScroll: e.detail.scrollTop
        }); 
        break;
      default:
      break;
    }
  },

  // 查看详情
  handleCheckDetail(e){
    console.log(e)
    if (!e.target.dataset.route && e.currentTarget.dataset.type == 2){
      wx.navigateTo({
        url: '/pages/columnDetail/columndetail?id=' + e.currentTarget.dataset.id
      })
    }
  },
  handleCheckDetailt(e){
    wx.navigateTo({
      url: '/pages/columnDetail/columndetail?id=' + e.currentTarget.dataset.id
    })
  },
  // 查看详情（haeder）
  handleCheckDetailt(e){
    wx.navigateTo({
      url: '/pages/columnDetail/columndetail?id=' + e.currentTarget.dataset.id
    })
  },
  // 评论
  handleComment(e){
    wx.navigateTo({
      url: '/pages/columnDetail/columndetail?id=' + e.currentTarget.dataset.id+'&input=1'
    })
  },

  // 好评
  handleRraise(e){
    let infoData = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index;
    if (!!infoData.IsLike){
      return;
    }
    http.postReq(api.likeInfo, { id: infoData.Id}).then(res=>{
      if(res.data.code == 0){
        if(res.data.state == 'success'){
          let infoList = this.data.dataList;
          infoData.Likes += 1;
          infoData.IsLike = true;
          infoList[index] = infoData;
          this.setData({
            dataList: infoList
          })
        }
      }
    })
  },

  /**
   * 专栏 切换
   */
  handleChange({ detail }) {
    var that = this;
    // 停止播放视频
    that.setData({
      _index:null
    })
    if (that.data.current === detail.key) {
      return false;
    }
    that.setData({ current: detail.key });
    // 已缓存数据 不在加载
    if (
      (that.data.current == '' && !!that.data.newArrList.length) ||
      (that.data.current == '0' && !!that.data.videoList.length) ||
      (that.data.current == '1' && !!that.data.audioList.length) ||
      (that.data.current == '2' && !!that.data.imgTextList.length)
    ){
      that.tabsChange(detail.key);
    }else{
      that.getInfos(that.data.current,true); //获取资讯列表
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.name,
    })
    var that = this;
    that.setData({
      schoolId: options.schoolId
    })
    this.getInfos(that.data.current,true); //获取资讯列表

  },
  // 关闭弹窗
  handleColseImg() {
    this.setData({
      show: false,
      isSaveImg: false
    })
  },
  // 保存海报
  handleSaveImg() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.saveImg(that.data.imgurl);
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImg(that.data.imgurl);
            },
            fail(){
              wx.showModal({
                title: '温馨提示',
                content: '您关闭了访问相册的权限，无法保存，请点击"去设置"允许访问相册~',
                cancelText: "暂不需要",
                confirmText: '去设置',
                confirmColor: '#2d8cf0',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting["scope.writePhotosAlbum"]) {
                          
                        } else {
                          console.log("获取权限失败")
                        }
                      }
                    })
                  } else if (res.cancel) {

                  }
                }
              })
            }
          })
        }
      }
    })
  },
  // 绘制海报
  handleDrawPoster(e) {
    let that = this;
    if (!!that.data.isSaveImg){
      return;
    }
    let items = e.currentTarget.dataset.item;
    that.setData({
      shareCoverImg: !!items.CoverImgUrl ? items.CoverImgUrl : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553764275055&di=f801de64fe244e4c1d7c3e7392d88d4c&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn%2Fw1200h750%2F20171207%2F8e60-fypikwu4060068.jpg',
      shareTitle: items.Title,
      userInfo: app.globalData.userInfo
    })

    that.getCode(items.Id, function () {
      that.drawImg();
    });
  },
  
  drawImg: function () {
    let that = this;
    // 创建画布
    wx.showLoading({
      title: '生成中,请稍等~'
    });
    that.setData({
      show: true
    })

    const ctx = wx.createCanvasContext('shareCanvas');
    // 白色背景
    ctx.save();
    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, 300, 380);
    ctx.stroke();
    ctx.draw(true);

   
    // 下载视频封面图
    wx.getImageInfo({
      src: that.data.shareCoverImg,
      success: (res2) => {
        ctx.drawImage(res2.path, 0, 0, 300, 200) //168

        // 分享标题
        // ctx.setTextAlign('center')    // 文字居中
        ctx.setFillStyle('#000') // 文字颜色：黑色
        ctx.setFontSize(18) // 文字字号：20px
        if (that.data.shareTitle.length <= 15) {
          // 不用换行
          ctx.fillText(that.data.shareTitle, 10, 225, 280)
        } else if (that.data.shareTitle.length <= 28) {
          // 两行
          let firstLine = that.data.shareTitle.substring(0, 14);
          let secondLine = that.data.shareTitle.substring(14, 27);
          ctx.fillText(firstLine, 10, 225, 280)
          ctx.fillText(secondLine, 10, 250, 280)
        } else {
          // 超过两行
          let firstLine = that.data.shareTitle.substring(0, 14);
          let secondLine = that.data.shareTitle.substring(14, 27) + '...';
          ctx.fillText(firstLine, 10, 225, 280)
          ctx.fillText(secondLine, 10, 250, 280)
          // 200 224
        }
        // 下载二维码
        wx.getImageInfo({
          src: that.data.ewmurl,
          success: (res3) => {
            let qrImgSize = 70
            ctx.drawImage(res3.path, 212, 266, qrImgSize, qrImgSize)
            ctx.stroke()
            ctx.draw(true)

            // 用户昵称
            ctx.setFillStyle('#000') // 文字颜色：黑色
            ctx.setFontSize(12) // 文字字号：16px
            ctx.fillText(that.data.userInfo.nickName, 38, 284)
            // 观看日期
            ctx.setFillStyle('#999') // 文字颜色：黑色
            ctx.setFontSize(10) // 文字字号：16px
            ctx.fillText('在' + that.data.seeDate + '浏览~', 38, 298);
            // 文字介绍
            ctx.setFillStyle('#80848f');
            ctx.setFontSize(12);
            ctx.fillText('识别小程序码', 15, 330);

            ctx.setFillStyle('#80848f');
            ctx.setFontSize(12);
            ctx.fillText('进入', 26, 350);

            ctx.setFillStyle('#4E84E6');
            ctx.setFontSize(14);
            ctx.fillText('潍柴动力', 58, 350);

            ctx.setFillStyle('#80848f');
            ctx.setFontSize(12);
            ctx.fillText('浏览阅读~', 120, 350);

            // 下载用户头像
            wx.getImageInfo({
              src: that.data.userInfo.avatarUrl,
              success: (res4) => {
                // 先画圆形，制作圆形头像(圆心x，圆心y，半径r)
                ctx.arc(22, 284, 12, 0, Math.PI * 2, false)
                ctx.clip()
                // 绘制头像图片
                let headImgSize = 26
                ctx.drawImage(res4.path, 10, 272, headImgSize, headImgSize)
                // ctx.stroke() // 圆形边框
                ctx.draw(true)
                wx.hideLoading();

                // // 保存到相册
                wx.canvasToTempFilePath({
                  canvasId: 'shareCanvas',
                  success: function (res) {
                    that.setData({
                      imgurl: res.tempFilePath
                    })
                  }
                }, this)
              }
            })
          }
        })
      }
    })
  },

  // 保存到相册
  saveImg(filePath) {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: function (res) {
        that.setData({
          isSaveImg:true
        });
        wx.showToast({
          title: '图片已保存到相册'
        })
      },
      fail: function (res) {
        if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {}
      }
    })
  },

  
  /**
   * 显示当前专栏
   * @curTag 当前页码
   */
  tabsChange: function(curTag) {
    let that = this;
    switch (curTag) {
      case "":
        that.setData({
          dataList: that.data.newArrList,
          scrollTop: that.data.newScroll
        });
        break;
      case "2":
        that.setData({
          dataList: that.data.imgTextList,
          scrollTop: that.data.imgtextScroll
        });
        break;
      case "0":
        that.setData({
          dataList: that.data.videoList,
          scrollTop:that.data.videoScroll
        });
        break;
      case "1":
        that.setData({
          dataList: that.data.audioList,
          scrollTop:that.data.audioScroll
        });
        break;
        default:
        that.setData({
          dataList: [],
          scrollTop:0
        });
        break;
    }
  },
  // 动态获取二维码
  getCode: function (scene,getCodeSuccess) {
    var that = this
    // 二维码 
    wx.request({
      // 调用接口C
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + app.globalData.wxToken,
      method: 'POST',
      responseType: 'arraybuffer', //二进制流类型
      data: {
        path: "pages/home/home",
        width: 100,
        scene:scene,
        is_hyaline: true
      },
      success(res) {
        var base64 = wx.arrayBufferToBase64(res.data);
        that.setData({ imgurl: "data:image/PNG;base64," + base64 });
        utils.base64src(that.data.imgurl).then(res => {
          that.setData({ ewmurl: res })
        })
        getCodeSuccess();
      },
      fail(){
        wx.showModal({
          title: '提示',
          content: '小程序请求超时，稍后再试~',
        })
      }
    })
  },

  //上拉加载 
  loadMore() {
    var that = this;
    if (
      (that.data.current == '' && that.data.newPage >= that.data.newTotal) || 
      (that.data.current == '2' && that.data.imgTextPage >= that.data.imgTextTotal) || 
      (that.data.current == '0' && that.data.videoPage >= that.data.videoTotal) || 
      (that.data.current == '1' && that.data.audioPage >= that.data.audioTotal)
    ) {
      return;
    }
    that.setData({ moreLoading: true }) //加载提示
    if (that.data.current == ''){
      that.setData({
        newPage: that.data.newPage + 1
      })
    } else if (that.data.current == '2'){
      that.setData({
        imgTextPage: that.data.imgTextPage + 1
      })
    } else if (that.data.current == '0') {
      that.setData({
        videoPage: that.data.videoPage + 1
      })
    }else{
      that.setData({
        audioPage: that.data.audioPage + 1
      })
    }
    that.getInfos(that.data.current);
   
  },

  // 下拉距离
  touchMove(e) {
    var that = this;
    if (e.touches[0].pageY - that.data.touch_down < 42 && that.data.start_scroll == 0) {
      that.setData({ freshLoading: true }) //下拉刷新显示
      that.setData({
        translateScroll: e.touches[0].pageY - that.data.touch_down,
        translateFresh: 42,
      })
    }
  },
  // start: 触摸开始
  start_fn(e) {
    let self = this;
    let touch_down = e.touches[0].clientY;
    this.data.touch_down = touch_down;
    // 获取 inner-wrap 的高度
    wx.createSelectorQuery().select('#inner-wrap').boundingClientRect(function (rect) {
      self.data.inner_height = rect.height;
    }).exec();

    // 获取 scroll-wrap 的高度和当前的 scrollTop 位置
    wx.createSelectorQuery().select('#scroll-wrap').fields({
      scrollOffset: true,
      size: true
    }, function (rect) {
      self.data.start_scroll = rect.scrollTop;
      self.data.height = rect.height;
    }).exec();
  },

  // start： 触摸结束
  end_fn(e) {
    let current_y = e.changedTouches[0].clientY;
    this.data.touch_end = current_y;
    let self = this;
    let { start_scroll, inner_height, height, touch_down } = this.data;
    /**
    * 1、下拉刷新
    * 2、上拉加载
    */
    if (current_y > touch_down && current_y - touch_down > 20 && start_scroll == 0) {
      // 下拉刷新 的请求和逻辑处理等
      self.setData({ translateScroll: 0 })
      // 最新
      if(self.data.current == ''){
        self.setData({newPage:1, newArr:[]})
      }else if (self.data.current == '2') {
        self.setData({ imgTextPage: 1, imgTextArr: [] })
      }else if (self.data.current == '0') {
        self.setData({ videoPage: 1, videoArr: [] })
      }else{
        self.setData({ audioPage: 1, audioArr: [] })
      }
      
      self.getInfos(self.data.current, true,true); //获取资讯列表

      
    } else if (current_y < touch_down && touch_down - current_y >= 20 && inner_height - height == start_scroll) {
      // 上拉加载 的请求和逻辑处理等
    }
  },

  /**
   * 获取资讯列表
   * isfresh 是否下拉刷新
   */
  getInfos(tab,load,isfresh){
    let that = this;
    http.getReq(api.getInfos,{
      curPage: tab == '' ? that.data.newPage : tab == '2' ? that.data.imgTextPage : tab == '0' ? that.data.videoPage : that.data.audioPage,
      pageSize: that.data.pageSize,
      type:tab,
      schoolId: that.data.schoolId  // 学院id
    }, !load && !!isfresh?false:true).then(res=>{
      if(res.data.code == 0 ){
        if(res.data.state == 'success'){
          if (tab == ''){
           // 最新
            let newData = that.data.newArr.concat(res.data.data.rows);
            that.setData({
              newArr: newData,
              newArrList:newData,
              newTotal:res.data.data.total
            })
          }else if(tab == '2'){
            // 图文
            let imgTextData = that.data.imgTextArr.concat(res.data.data.rows);
            that.setData({
              imgTextArr: imgTextData,
              imgTextList: imgTextData,
              imgTextTotal: res.data.data.total
            })
          }else if(tab == '0'){
            // 视频
            let videoData = that.data.videoArr.concat(res.data.data.rows);
            that.setData({
              videoArr: videoData,
              videoList: videoData,
              videoTotal: res.data.data.total
            })
          }else{
            // 音频
            let audioData = that.data.audioArr.concat(res.data.data.rows);
            that.setData({
              audioArr: audioData,
              audioList: audioData,
              audioTotal: res.data.data.total
            }) 
          }
          that.tabsChange(tab); 
          if (!!isfresh) {
            that.setData({ freshLoading: false });
            $Message({
              content: '刷新动态成功~',
              type:'success'
            });
          }
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },

/**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      let data = that.data.dataList[res.target.dataset.index];
      return {
        title: data.Title,
        path: '/pages/home/home?scene=' + data.Id,
        imageUrl: data.CoverImgUrl
      }
    }
    return {
      title: '自定义转发标题',
      path: 'pages/column/column?type=' + that.data.current + '&schoolId=' + that.data.schoolId,
    }
  },
})

