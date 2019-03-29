// pages/addAdress/addAdress.js
const http = require("../../utils/http.js"); //require引入
const api = require("../../utils/api.js");
const app = getApp();
const { $Message } = require('../../dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['', '', ''],
    customItem: '全部',
    name:'狄仁杰',
    phone:'18888088088', 
    address: '',//详细地址
    defaultAddr: false,
    addrId:'',// 编辑地址
    Default:0  //列表为空默认地址
  },
  // 选择区域地址
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  // 是否默认
  onChange(event) {
    this.setData({
      defaultAddr: event.detail.value
    })
  },
  // 收货人
  handleChangeName(e){
    this.setData({
      name: e.detail.detail.value
    })
  },
  //电话
  handleChangePhone(e) {
    this.setData({
      phone: e.detail.detail.value
    })
  },
  // 地址
  handleChangeAddr(e) {
    this.setData({
      address: e.detail.detail.value
    })
  },

  // 保存
  handleSaveAddr(){
    
    if (!this.data.name){
      $Message({content: '请填写收货人姓名', type: 'warning'});
      return;
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phone))){
      $Message({ content: '请填写正确手机号', type: 'warning' });
      return;
    } else if (!this.data.region[0] || !this.data.region[1]){
      $Message({ content: '请选择区域地址', type: 'warning' });  
      return;
    } else if (this.data.address.length < 5 ) {
      $Message({ content: '请填写完整详细地址', type: 'warning' });
      return;
    }

    http.postReq(api.saveAddress,{
      Receiver: this.data.name,
      PhoneNumber:this.data.phone,
      Province: this.data.region[0], //省
      City: this.data.region[1],   //市
      District: this.data.region[2],  //地区
      DetailAddress:this.data.address, // 详细地址
      Id: !!this.data.addrId ? this.data.addrId:'',
      IsDefault: this.data.Default==1?true:this.data.defaultAddr  //是否默认
    },true).then(res=>{
      console.log(res)
      if(res.data.code == 0){
        wx.showLoading({
          title: '保存成功',
        })
        app.globalData.relatedInfo.HasAddress = true;
        // 返回页面 delta 返回页面数
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  onLoad(option) {
    // 是否地址列表为空
    if (!!option.isDefault){
      this.setData({
        Default: option.isDefault
      })
    }else{
      // 编辑
      let addrDetail = JSON.parse(option.addrDetail);
      let region = [addrDetail.Province, addrDetail.City, addrDetail.District]  //省市区
      this.setData({
        name: addrDetail.Receiver,
        phone: addrDetail.PhoneNumber,
        address: addrDetail.DetailAddress,
        defaultAddr: addrDetail.IsDefault,
        region: region,
        addrId: addrDetail.Id
      })
    }
  }
})

