Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponinfoUsed: "",
    couponinfo: ""
  },
  //折叠处理函数
  onFold: function(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    getApp().crabRequest(
      'crabCoupon/getSellerInfo',
      "GET", {},
      //成功事件
      function(e) {
        var datas = e.data.data;
        console.log(datas);
        that.setData({
          couponinfoUsed: datas.couponinfo[0],
          couponinfo: datas.couponinfo[1]
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

  }
})