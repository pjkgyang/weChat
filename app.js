//app.js
var http = require("utils/http.js"); //require引入
var api = require("utils/api.js");
const updateManager = wx.getUpdateManager()
App({
  onLaunch: function() {

    this.globalData.scene = wx.getLaunchOptionsSync().scene;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: 'zh_CN',
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              this.globalData.authHide = false;

              // 检测token是否过期
              http.getReq(api.getLoginUser, {
                access_token: wx.getStorageSync('token')
              }).then(res => {
                if (res.data.code == 0) {
                  this.globalData.relatedInfo = res.data.data;  //项目信息
                  wx.setStorage({ key: 'token', data: res.data.data.Access_token });
                } else if (res.data.code == 401) {
                  wx.login({
                    success: (res) => {
                      http.postReq(api.userlogin, {
                        code: res.code,
                        source: this.globalData.scene
                      }).then(res => {
                        if (res.data.code == 0) {
                          wx.setStorage({ key: 'token', data: res.data.data.Access_token });
                          this.globalData.relatedInfo = res.data.data;//项目信息
                          if (!!res.data.Update) {   //是否需要更新用户信息
                            http.postReq(api.update, {//更新用户信息
                              UserName: this.globalData.userInfo.nickName,
                              Gender: this.globalData.userInfo.gender,
                              Avatar: this.globalData.userInfo.avatarUrl,
                              Country: this.globalData.userInfo.country,
                              Province: this.globalData.province,
                              City: this.globalData.city
                            }, false, res.data.data.Access_token).then(res => {
                              if (res.data.code == 0) {

                              }
                            })
                          }
                        }
                      })
                    }
                  })
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: res => {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      },
    })
  },
  onShow: function() {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx78ae778d45cd3547&secret=5c6583a41c751aa0124e44af93ad0247',
      method:'GET',
      success:function(res){
        that.globalData.wxToken = res.data.access_token
      }
    });

    // 请求完新版本信息的回调
    // updateManager.onCheckForUpdate(function (res) {
    //   console.log(res)
    //   if (res.hasUpdate){
    //     wx.showModal({
    //       title: '更新提示',
    //       content: '检测到有新版本更新，是否下载更新？',
    //       success(res) {
    //         if (res.confirm) {
    //           updateManager.onUpdateReady(function () {
    //             wx.showModal({
    //               title: '更新提示',
    //               content: '新版本已经准备好，是否重启应用？',
    //               success(res) {
    //                 if (res.confirm) {
    //                   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //                   updateManager.applyUpdate()
    //                 }
    //               }
    //             })
    //           })
    //         }
    //       }
    //     })
    //   }
    // })  
  },
  globalData: {
    userInfo: null,
    authHide: '',
    scene: '',
    isAuth: true,
    relatedInfo:{},
    wxToken:'',//微信token
    giftDetail:'', //所选商品详情
    address:''//当前所选地址
  },

  // 初始用户数据
  getUserInit(initInfo){
    http.getReq(api.getUserInit,{}).then(res=>{
      if(res.data.code == 0){
        if(res.data.state == 'success'){
          this.globalData.relatedInfo = res.data.data;
          initInfo();
        }
      }
    })
  }
})