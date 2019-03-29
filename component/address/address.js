// component/address/address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isedit:{
      type:Boolean,
      value:false
    },
    address:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择地址列表
    handleChooseAddr:function(e) {
      this.triggerEvent('handleChooseAddr','') 
    },
    // 编辑
    handleEditAddr:function(e){
      this.triggerEvent('handleEditAddr', e.currentTarget.dataset.item)
    },
    // 删除
    handleDeleteAddr: function (e) {
      console.log(e);
      this.triggerEvent('handleDeleteAddr', e.currentTarget.dataset)
    },
    handleSetDefault:function(e){
      this.triggerEvent('handleSetDefault', e.currentTarget.dataset.id)
    }

  }
})
