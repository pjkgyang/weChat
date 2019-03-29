module.exports = {

  /**
   * 用户
   */
  userlogin:'user/login', // 用户登陆
  update: 'user/update',  // 更新登陆
  getLoginUser:'user/getLoginUser',//获取用户登录
  integralrank: 'user/integralrank',//获取用户积分排名
  questionrank:'user/questionrank',//获取用户问题排名
  userAddresses:'user/userAddresses',//获取用户地址列表
  getDefaultAddr:'user/defaultAddr', // 获取用户默认地址
  getAddress:'user/getAddress',//获取地址
  setDefaultAddr:'user/setDefaultAddr',//设置用户默认地址
  saveAddress:'user/saveAddress',//保存地址
  deleteAddress:'user/deleteAddress',//删除地址
  userIntegralLogs: 'user/userIntegralLogs',//获取积分流水   
  getUserInit:'user/getUserInit',//更新用户信息

  /**
   * 签到
   */
  signin: 'signin/signin',//签到

  /**
   * 首页
   */
  getBanners:'common/banners', //获取banner
  getSchools: 'common/schools', //获取学院

  /**
   * 资讯
   */
  getComments: 'info/comments',//获取资讯评论列表
  getInfos: 'info/infos',//获取资讯列表
  getInfo: 'info/getInfo',//获取资讯
  viewInfo:'info/view', // 浏览资讯
  likeInfo:'info/like', //点赞资讯
  shareInfo:'info/share',//转发资讯
  commentInfo:'info/comment',//评论资讯

  /**
   * 积分商城
   */
  getGifts:'gift/gifts',//获取商品列表
  getGift: 'gift/getGift',//获取商品详情
  exchangeGift:'gift/exchangeGift',//兑换礼品
  exchangeLogs: 'gift/exchangeLogs',//兑换礼品记录

  /**
   * 问答
   */
   getUserAnswerFrequency:'question/getUserAnswerFrequency', //获取剩余答题次数
   getUserTestPaper:'question/GetUserTestPaper', // 获取问题题目
   submitAnswer:'question/SubmitAnswer', //提交答案

  /**
   * 任务
   */
  getTask: 'task/tasks' //获取任务列表
}