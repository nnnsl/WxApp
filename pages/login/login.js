//获取应用实例
const app = getApp()
import Notify from '../../dist/notify/notify';
const utilMd5 = require('../../utils/MD5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户名登录属性状态
    btn1msg: '登录',
    loading: '',
    loadingtext: '',
    username: '',
    password: '',
    loaded: false,
    checked: true,
    userpassword: '',
    disabled_user: '',
    disabled_psd: '',
    list: ['a', 'b', 'c'],
    result: ['a', 'b']
  },
  onChange(event) {
    this.setData({
      checked: event.detail
    });
  },
  //监听用户名输入
  monitor_user: function(e) {
    this.setData({
      username: e.detail
    })
  },
  //监听用户密码输入
  monitor_psd: function(e) {
    this.setData({
      password: e.detail
    })
  },
  login: function() {
    var that = this;
    var mobile = that.data.username;
    var password = that.data.password;
    //验证手机号不为空
    if (mobile == "") {
      Notify({
        text: '请填写邮箱',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#ff4d4f'
      });
      return false
    }
    //验证邮箱为正确格式
    var myreg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!myreg.test(mobile)) {
      Notify({
        text: '请填写正确的邮箱格式',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#faad14'
      });
      return false;
    }
    //验证密码不为空
    if (password == "") {
      Notify({
        text: '请填写密码',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#ff4d4f'
      });
      return false
    }
    this.setData({
      disabled_user: true,
      disabled_psd: true,
      loaded: true
    })

    // 利用通用请求获取数据
    getApp().ixzRequest(
      'Seller/Login',
      "GET", {
        username: mobile,
        password: utilMd5.hexMD5(password)
      },
      //成功事件
      function(e) {
        if (e.data.code == '2') {
          //登录请求回来之后,读取res的header的cookie
          //这里的sessionid随便写的,就是个唯一标识
          //wx.setStorageSync("Storage", e.header["Set-Cookie"]);
          if (that.data.checked == true) {
            wx.setStorage({
              key: 'mobile',
              data: mobile,
              success: function(res) {
              }
            });
            wx.setStorage({
              key: 'password',
              data: password,
              success: function(res) {
              }
            });
            wx.setStorage({
              key: 'fullname_seller',
              data: e.data.data,
              success: function(res) {
              }
            });

          } else {
            wx.clearStorage({
              key: 'mobile',
              data: mobile,
              success: function(res) {}
            });
            wx.clearStorage({
              key: 'password',
              data: password,
              success: function(res) {}
            });
          }
          Notify({
            text: '登录成功！正在跳转...',
            duration: 2000,
            selector: '#custom-selector',
            backgroundColor: '#52c41a'
          });
          setTimeout(function() {
            wx.reLaunch({
              url: '../index/index'
            })
          }, 2000) //延迟时间
        } else {
          Notify({
            text: e.data.msg,
            duration: 2000,
            selector: '#custom-selector',
            backgroundColor: '#ff4d4f'
          });
          that.setData({
            loaded: false
          });
        }
      },
      // 错误事件
      function(e) {
        //clearInterval(Interval);
      });
    this.setData({
      disabled_user: "",
      disabled_psd: "",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userName = wx.getStorageSync('mobile');
    var userPassword = wx.getStorageSync('password');
    this.setData({
      username: userName
    });
    this.setData({
      password: userPassword
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