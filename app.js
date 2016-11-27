//app.js
App({
  globalData:{
    userInfo:null,
    birthday: null,
    months: []
  },
  onLaunch: function () {    
    this.getUserInfo();
    this.globalData.birthday = wx.getStorageSync('birthday') || null;
    this.globalData.months = wx.getStorageSync('months') || [];
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  }
})