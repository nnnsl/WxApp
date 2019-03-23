import Toast from '../../dist/toast/toast';
const QRCode = require('../../utils/weapp-qrcode.js');
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
import rpx2px from '../../utils/rpx2px.js'
let qrcode;
//index.js
//获取应用实例
const app = getApp();
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(400);
const couponList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    show: false,
    QRshow: true,
    TokenID: '',
    coupon_value: '请选择优惠券',
    coupon_id: '',
    qrcodeWidth: qrcodeWidth,
    couponList: couponList
  },
  //开关事件
  onChange(event) {
    var that = this;
    var thisdata = this.data;
    // 需要手动对 checked 状态进行更新
    if (thisdata.coupon_value == '请选择优惠券') {
      Toast.fail({
        message: "请选择优惠券",
        duration: 1500
      });
    } else {
      this.setData({
        checked: event.detail
      });
      if (thisdata.checked == true) {
        var id = that.data.coupon_id;
        Toast.loading({
          mask: true,
          duration: 0,
          message: '生成中...'
        });
        //打开websocket
        that.openNewWebSocket();
        //生成二维码
        //获取优惠券id用于生成二维码
        getApp().ixzRequest(
          'QRcode/couponQr',
          "POST", {
            id: id
          },
          //成功事件
          function(e) {
            Toast.clear();
            var bid = e.data.data.bid;
            var QR = "https://www.ixiaozha.com/j/api/QRcode/QRjump?bid=" + bid
            that.MakeQR(QR);
          },
          function(e) {
            console.log(e);
            //clearInterval(Interval);
          });
        this.setData({
          QRshow: true
        });
      } else {
        that.setData({
          checked: true
        });
        wx.showModal({
          title: '提示',
          content: '您确定关闭二维码生成吗？',
          success: function(sm) {
            if (sm.confirm) {
              //点击确定事件
              that.setData({
                checked: false
              });
              //主动关闭 WebSocket
              that.closeWebSocket();
            } else if (sm.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      }
    }
  },
  //手动刷新二维码
  QRrefresh() {
    Toast.loading({
      mask: true,
      duration: 0,
      message: '刷新中...'
    });
    var that = this;
    var id = this.data.coupon_id;
    //获取优惠券id用于生成二维码
    getApp().ixzRequest(
      'QRcode/couponQr',
      "POST", {
        id: id
      },
      //成功事件
      function(e) {
        Toast.clear();
        var bid = e.data.data.bid;
        var QR = "https://www.ixiaozha.com/j/api/QRcode/QRjump?bid=" + bid
        that.MakeQR(QR);
      },
      function(e) {
        console.log(e);
        //clearInterval(Interval);
      });
  },

  //选择事件
  selectCoupon(event) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      show: true
    });
  },

  //弹出层点击蒙层时触发事件
  onOverlay() {
    this.setData({
      show: false
    });
  },
  //上拉选择框的确定事件
  onConfirm(event) {
    this.setData({
      coupon_value: event.detail.value.text,
      coupon_id: event.detail.value.id,
      show: false,
      checked: false
    });
  },
  //上拉选择框的取消事件
  onCancel() {
    console.log('取消');
    this.setData({
      show: false
    });
  },

  //生成二维码
  MakeQR(text) {
    qrcode = new QRCode('canvas', {
      // usingIn: this,
      text: text,
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "black",
      colorLight: "white",
    });
  },
  //打开WebSocket
  openNewWebSocket: function() {
    var that = this;
    var tokenId = this.data.TokenID;
    var url = "wss://test.hntheway.com/j/ws/adminwebsocket/tokenId/" + tokenId;
    try {
      this.initEventHandle(url);
    } catch (e) {
      console.log("websocket建立失败！");
      //reconnect(url);
    }
  },

  //WebSocket回调方法
  initEventHandle: function(url) {
    //创建WebSocket
    wx.connectSocket({
      url: url,
      success: function(res) {
        //      console.log(options);
      },
      fail: function(res) {
        //      console.log(options);
      }
    });
    //监听 WebSocket 建立事件
    wx.onSocketOpen(function(res) {
      console.log("建立连接成功！");
    });
    //监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function(res) {
      console.log("接受消息成功！" + res);
      //提示领取成功然后自动刷新
      Notify({
        text: '领取成功！',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#52c41a'
      });
      //刷新二维码
      that.QRrefresh();
    });
    //监听 WebSocket 错误事件
    wx.onSocketError(function(res) {
      console.log("接受消息错误！");
    });
    //监听 WebSocket 连接关闭事件
    wx.onSocketClose(function(res) {
      console.log("已经关闭！");
    });
  },

  //主动关闭 WebSocket 事件
  closeWebSocket: function() {
    console.log("我要关闭了");
    //主动关闭 WebSocket
    wx.closeSocket();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //创建header 
    var header = wx.getStorageSync("Storage"); //读取cookie
    var ca = header.split(';');
    var name = "TokenID=";
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      //this.data.TokenID = c.substring(name.length, c.length);
      if (c.indexOf(name) == 0 && name != "") {
        this.data.TokenID = c.substring(name.length, c.length);
      }
    }
    //获取优惠券列表
    getApp().crabRequest(
      'crabCoupon/getSellerCoupons',
      "GET", {},
      //成功事件
      function(e) {
        var lists = e.data.list;
        var aa = [];
        for (var i = 0; i < lists.length; i++) {
          aa.push({
            text: lists[i].couponame,
            id: lists[i].u_couponsetting_id
          });
          that.setData({
            couponList: aa
          });
        }
        //that.setData({
        //uparkingarea: datas.uparkingarea,
        //});
      },
      function(e) {
        Toast.fail('调取接口失败');
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