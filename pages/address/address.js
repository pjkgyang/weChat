// pages/address/address.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPage:1,
    pageSize:15,
    total:0,//总页数
    addressList: [],
    addressArr: []  //地址列表
  },
  /**
   * 获取用户地址列表
   */
  getUserAddress(){
    // 获取用户地址列表
    http.getReq(api.userAddresses, { curPage: this.data.curPage, pageSize: this.data.pageSize },true).then(res => {
      if (res.data.code == 0) {
        let addressData = this.data.addressList.concat(res.data.data.rows);
        this.setData({
          total: res.data.data.total,
          addressArr: addressData,
          addressList: addressData
        })
      }
    })
  },
  /**
   *添加收货地址
   */
  handleAddAdress() {
    let isdefault = !this.data.addressArr.length ? '1' : '0'
    wx.navigateTo({
      url: '/pages/addAdress/addAdress?isDefault=' + isdefault
    })
  },
  // 选择地址
  handleChooseAddr(e){
    app.globalData.address = e.detail;
    wx.navigateTo({
      // url: '/pages/addrcommit/addrcommit?address='+JSON.stringify(e.detail)
      url: '/pages/addrcommit/addrcommit?address=1'
    })
  },
  // 编辑
  handleEditAddr(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/addAdress/addAdress?addrDetail=' + JSON.stringify(e.detail)
    })
  },
  // 删除
  handleDeleteAddr(e) {
    http.postReq(api.deleteAddress, { addrId: e.detail.id},true).then(res=>{
      if(res.data.code == 0){
        this.data.addressArr.splice(e.detail.index, 1);
        this.setData({
          addressArr: this.data.addressArr
        });
        if (!this.data.addressArr.length){
          app.globalData.relatedInfo.HasAddress = false;
        }
        $Message({
          content: '删除成功~',
          type: 'success'
        });
      }
    })
  },
  // 设为默认
  handleSetDefault(e) {
    console.log(e)
    http.postReq(api.setDefaultAddr,{
      addrId:e.detail
    }).then(res=>{
      if(res.data.code == 0){
        this.setData({
          curPage: 1,
          addressList: []
        })
        this.getUserAddress();
        $Message({
          content: '设置成功~',
          type: 'success'
        }); 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.setData({
      curPage:1,
      addressList:[]
    })
    this.getUserAddress();
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
    console.log('===')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})