//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: null,
    birthday: null,
    months:[],
    animation: [],
    selected: -1
  },
  // cells per row, configured here
  perRow: 24,
  // calculate rows/colums
  layoutGrid: function(){
    var columns = [];
    for(var i=0;i<this.perRow;i++){
      columns.push(i);
    }
    var rows = [];
    for(var j=0;j<1200/this.perRow;j++){
      rows.push(j);
    }
    this.setData({
      rows: rows,
      columns: columns,
      perRow: this.perRow
    });
  },
  //事件处理函数
  cellTapped: function(e){
    this.setData({
      clickx: e.detail.x,
      clicky: e.detail.y
    });
    var idx = e.currentTarget.dataset['idx'];
    console.log(parseInt(idx));
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    }).top(0).left(0).bottom(0).right(0).opacity(1).step();
    this.setData({
      selected: parseInt(idx),
      animation: this.animation.export()
    })
  },
  bindDateChange: function(e){
    var bday = new Date(e.detail.value);
    var year = bday.getFullYear();
    var month = bday.getMonth()+1;
    var months = [];
    for(var i=0;i<1200;i++){
      var monthObj = {
        year: year,
        month: month,
        events: ["item1", "item2", "item3"],
        mood: 0
      };
      months.push(monthObj);
      month = month + 1;
      if(month>12){
        year += 1;
        month = 1;
      }
    }
    // save to local storage
    wx.setStorageSync('birthday', bday)
    wx.setStorageSync('months', months)
    // refresh view
    this.setData({
      birthday: bday,
      months: months
    });
    this.layoutGrid();
  },
  closeEditor: function(){
    this.animation.top(this.data.clickx).left(this.data.clicky).bottom(0).right(0).opacity(0).step();
    this.setData({
      animation: this.animation.export()
    })
  },
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    this.setData({
      birthday: app.globalData.birthday,
      months: app.globalData.months
    });
   // if(app.globalData.months){
      this.layoutGrid();
    //}
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    
  }
})
