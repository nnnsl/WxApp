//获取应用实例
const app = getApp()
import Toast from '../../dist/toast/toast';
import Notify from '../../dist/notify/notify';
import Dialog from '../../dist/dialog/dialog';
const utilMd5 = require('../../utils/MD5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    old_password: "",
    new_password: "",
    again_password: ""
  },

  //旧密码输入
  old_passwordinput: function(e) {
    this.setData({
      old_password: e.detail
    });
  },
  //新密码输入
  new_passwordinput: function(e) {
    this.setData({
      new_password: e.detail
    });
  },
  //新密码再次输入
  again_passwordinput: function(e) {
    this.setData({
      again_password: e.detail
    });
  },
  //修改按钮事件
  changePassword: function() {
    var that = this;
    var oldpass = that.data.old_password;
    var newpass = that.data.new_password;
    var againpass = that.data.again_password;
    //旧密码验证规则
    if (oldpass == "") {
      Notify({
        text: '请填写旧密码',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#ff4d4f'
      });
      return false
    }
    //新密码验证规则
    if (newpass == "") {
      Notify({
        text: '请填写新密码',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#ff4d4f'
      });
      return false
    } else if (newpass.length < 6) {
      Notify({
        text: '新密码长度不能少于6位',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#ff4d4f'
      });
    } else if (againpass == "") {
      Notify({
        text: '请再次填写新密码',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#ff4d4f'
      });
      return false
    } else if (newpass != againpass) {
      Notify({
        text: '两次密码不一样',
        duration: 2000,
        selector: '#custom-selector',
        backgroundColor: '#ff4d4f'
      });
    } else {
      Dialog.confirm({
        title: '标题',
        message: '您确定要修改密码吗？'
      }).then(() => {
        Toast.loading({
          message: '处理中...'
        });
        //确定事件
        // 利用通用请求获取数据
        getApp().ixzRequest(
          'comuser/changePass', "POST", {
            oldPass: utilMd5.hexMD5(oldpass),
            newpass: utilMd5.hexMD5(newpass)
          },
          //成功事件
          function(e) {
            console.log(e);
            if (e.data.code == 14) {
              Toast.success({
                message: '修改成功！',
                duration: 2000
              });
            } else {
              Toast.fail({
                message: e.data.msg,
                duration: 2000
              });
            }
          },
          // 错误事件
          function(e) {
            Toast.fail({
              message: e.data.msg,
              duration: 2000
            });
          });
      }).catch(() => {
        //取消事件
      });
    }
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