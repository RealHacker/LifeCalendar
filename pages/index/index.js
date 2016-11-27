//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: null,
    birthday: null,
    months:[],
    animation: [],
    selected: -1,
    currentIndex: -1
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
  getCurrentMonthIndex: function(d){
    var diff = util.getCurrentMonthIndexSince(d);
    console.log(diff);
    this.setData({currentIndex: diff})
    return diff;
  },
  //事件处理函数
  cellTapped: function(e){
    // Place the editor at the bottom of screen
    var res = wx.getSystemInfoSync();
    var wh = res.windowHeight;
    this.setData({
      starty: wh
    });
    var idx = e.currentTarget.dataset['idx'];
    
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    }).top(0).bottom(0).right(0).opacity(1).step();
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
        events: ["Eat", "Pray", "Love"],
        mood: 5
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
    this.getCurrentMonthIndex(bday);
  },
  formSubmit: function(e){
    var formData = e.detail.value;
    var months = app.globalData.months;
    months[this.data.selected].mood = formData.happiness;
    months[this.data.selected].events = [formData.item0, formData.item1, formData.item2];
    wx.setStorageSync('months', months);
    this.setData({months: months})
    this.closeEditor();
  },
  closeEditor: function(){
    var res = wx.getSystemInfoSync();
    var wh = res.windowHeight;
    this.animation.top(wh).opacity(0).step();
    this.setData({
      animation: this.animation.export()
    })
  },

  onLoad: function () {
    var that = this;
    app.getUserInfo(function(userInfo){      
      that.setData({
        userInfo: userInfo,
        birthday: app.globalData.birthday,
        months: app.globalData.months
      })
      that.layoutGrid();
      that.getCurrentMonthIndex(app.globalData.birthday);
    });
    
  }
})
