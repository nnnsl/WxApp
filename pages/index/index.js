//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    fullname: '',
    active: 0,
    userInfo: {},
    uparkingarea:'',
    activeNames: ['1'],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //折叠处理函数
  onFold: function(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  //跳转处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var fullname_seller = wx.getStorageSync('fullname_seller');
    that.setData({
      fullname: fullname_seller.fullname
    });
    getApp().crabRequest(
      'crabCoupon/getSellerInfo',
      "GET", {},
      //成功事件
      function(e) {
        var datas = e.data.data;
        that.setData({
          uparkingarea: datas.uparkingarea,
        });
      },
      function(e) {
        console.log(e);
        //clearInterval(Interval);
      });
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

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})