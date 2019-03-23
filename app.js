App({
  onLaunch: function(opt) {
    // 数据加载提示
    wx.showLoading({
      title: '加载中...',
    })

    //记录时间到本地缓存
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    //查找用户本地信息
  },
  onShow: function() {
    //    console.log('App Show');
    //加载完毕
    wx.hideLoading();
    // this.globalData.Storage = wx.getStorageSync('Storage');

  },
  onHide: function() {
    //   console.log('App Hide');
  },
  globalData: {
    paytype: 7, //支付方式  7、11
    statusBarHeight: 0,
    titleBarHeight: 0,
    hasLogin: false,
    lbskey: 'WWLBZ-XL76F-HQHJH-N2WAL-56VU3-ERFWO',
    //servsers: "https://test.hntheway.com/j",
    servsers: "https://www.hntheway.com/j",
    apiCtxPath: "https://test.hntheway.com/j/api/",
    jcarCtxPath: "https://test.hntheway.com/j/crab/",
    webSocketUrl: "ws://www.hntheway.com/j/ws/adminwebsocket/tokenId/"
    //  servsers: "https://test.ixiaozha.com/j",
    //  webSocketUrl: "wss://test.ixiaozha.com/j/ws/websocket/tokenId/"
    // datafl: false,
    // Storage: ''
  },
  //整体判断用户是否登录
  getloginUser: function() {
    var that = this;

    wx.showLoading({
      title: '读取您的登录信息',
    })

    var userinfo = wx.getStorageSync('Storage') || [];

    //   console.log(userinfo+'aaaa');

    wx.request({
      url: that.globalData.servsers + '/crab/crabParking/checkLogin',
      header: {
        "Cookie": userinfo
      },
      //header:1,
      success: function(e) {
        //    console.log(e);
        if (e.data.code == 20) {
          //     console.log('用户过期');
          that.goToLogin();
        }
      }
    })


    wx.hideLoading();

  },
  //整体判断用户跳转
  goToLogin: function() {
    //    console.log('准备跳转')
    wx.navigateTo({
      url: '../login/index'
    })
  },
  //整体请求
  // _url：请求地址
  // _data:请求参数
  // _successfunc:成功处理事件
  // _errfunc:错误处理事件
  ixzRequest: function(_url, _method, _data, _successfunc, _errfunc) {

    var that = this;
    var userinfo = wx.getStorageSync('Storage') || [];
    wx.request({
      url: that.globalData.apiCtxPath + _url,
      header: {
        "Cookie": wx.getStorageSync('Storage') || [],
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: _method,
      //header:1,
      data: _data,
      success: function(e) {
        _successfunc(e);  
      },
      error: function(e) {
        _errfunc(e);
      }
    })

  },
  //整体请求
  // _url：请求地址
  // _data:请求参数
  // _successfunc:成功处理事件
  // _errfunc:错误处理事件
  crabRequest: function(_url, _method, _data, _successfunc, _errfunc) {

    var that = this;
    var userinfo = wx.getStorageSync('Storage') || [];
    wx.request({
      url: that.globalData.jcarCtxPath + _url,
      method: _method,
      header: {
        "Cookie": userinfo
      },
      //header:1,
      data: _data,
      success: function(e) {
        _successfunc(e);
      },
      error: function(e) {
        _errfunc(e);
      }
    })

  },
});