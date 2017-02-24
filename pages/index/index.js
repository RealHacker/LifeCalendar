//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    userInfo: null,
    birthday: null,
    birth_year: null,
    birth_month: null,
    current_year: null,
    current_month: null,
    currentIndex: -1,
    months:{},
    selected_year: null
  },
  isMonthShown: false,
  getCurrentMonthIndex: function(d){
    var diff = util.getCurrentMonthIndexSince(d);
    return diff;
  },

  //事件处理函数
  yearTapped: function(e){
    var tappedyear = e.currentTarget.dataset['year'];
    var current_year = (new Date()).getFullYear();
    if(tappedyear>current_year){
      wx.showToast({
        title: "时光机未上线:)",
        duration: 2000
      });
      return;
    }
    console.log("Year tapped"+e.currentTarget.dataset['year']);
    this.animation = wx.createAnimation({
      // transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease",
      delay: 0
    }).top(0).bottom(0).left(0).right(0).opacity(1).step();

    this.data.selected_year = e.currentTarget.dataset['year'];
    this.updateView();
    this.setData({animation: this.animation.export()});
    this.isMonthShown = true;
  },

  bindDateChange: function(e){
    var bday = new Date(e.detail.value);
    var year = bday.getFullYear();
    var month = bday.getMonth()+1;

    // save to local storage
    wx.setStorageSync('birthday', bday)
    wx.setStorageSync('months', {})
    // save to global data
    app.globalData.birthday = bday;
    // refresh view
    this.data.birthday = bday;
    this.data.birth_year = year;
    this.data.birth_month =  month;

    var now = new Date();
    var current_year = now.getFullYear();
    var current_month = now.getMonth()+1;

    this.data.months = this.populateData(year, month, current_year, current_month);
    this.data.currentIndex = this.getCurrentMonthIndex(bday);
    this.updateView();

    if(!app.launched){
      app.launched = true;
      wx.setStorageSync('launched', true);
      wx.showModal({
        title: '小提示',
        content: '点击月历中的小圆点，纪录生命中每个月的心情和大事件！'
      });
    }
  },

  closeSelf: function(){
    var res = wx.getSystemInfoSync();
    var wh = res.windowHeight;
    
    this.animation=wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0
    }).top(wh).opacity(0).step();
    this.setData({
      animation: this.animation.export()
    });
    this.isMonthShown = false;
  },

  // handle swipe down gesture - close year grid
  // touchStart: function(e){
  //   console.log("start");
  //   this.startx = e.detail.x;
  //   this.starty = e.detail.y;
  //   return true;
  // },
  // touchEnd: function(e){
  //   console.log("end");
  //   this.endx = e.detail.x;
  //   this.endy = e.detail.y;
  //   if(this.endy-this.starty>30){
  //     this.closeSelf();
  //   }
  //   return true;
  // },

  monthTapped: function(e){
    var year = e.currentTarget.dataset['year'];
    var month =  e.currentTarget.dataset['month'];

    if(year == this.data.birth_year && month <this.data.birth_month){
      wx.showToast({title: "这个月您还未降生呐！", duration:1000});
      return;
    } else if(year == this.data.current_year && month > this.data.current_month){
      wx.showToast({title: "时光机未上线:)", duration:1000});
      return;
    }
    app.globalData.selected_year = year;
    app.globalData.selected_month = month;
    
    wx.navigateTo({
      url: '../editor/editor',
      success: function(res){
        console.log("Navigation success");
      },
      fail: function() {
        // fail
      }
    });
    console.log("Tapped year and month", year, month);
  },

  populateData: function(byear, bmonth, cyear, cmonth){
    var months = app.globalData.months;
    var exit = false;
    for(var y=0;y<100;y++){
      for(var m=0;m<12;m++){
        var year = byear+y;
        var month = m+1;
        if(year==byear&&month<bmonth) continue;
        if(year>cyear||(year==cyear&&month>cmonth)) {
          exit = true;
          break;
        }
        var key = ""+year+""+month;
        var value = months[key];
        if(!value){
          months[key] = {
            year: year,
            month:month,
            events: [],
            mood: 3
          }
        }
      }
      if(exit) break;
    }
    return months;
  },

  measure: function(){
    var headerHeight=100;
    var footerHeight=60;
    var res = wx.getSystemInfoSync();
    var wh = res.windowHeight;
    var ww = res.windowWidth;
    var cellheight = (wh-headerHeight-footerHeight)/4;
    var cellwidth = (ww-30)/3;
    this.data.screenHeight = wh;
    this.data.cellWidth = cellwidth;
    this.data.cellHeight =  cellheight;
  },

  updateView: function(){
      this.setData(this.data);
      if(this.isMonthShown){
        this.animation.top(0).bottom(0).left(0).right(0).opacity(1).step();
        this.setData({animation: this.animation.export()});
      }
  },

  onLoad: function () {
    var that = this;
    app.getUserInfo(function(userInfo){  
      that.data.userInfo = userInfo;
      that.data.birthday = app.globalData.birthday;
      
      var year, month;
      if(app.globalData.birthday){
        year = app.globalData.birthday.getFullYear();
        month = app.globalData.birthday.getMonth()+1;
      } else {
        year = null;
        month = null;
      }
      that.data.birth_year = year;
      that.data.birth_month = month;

      var now = new Date();
      var current_year = now.getFullYear();
      var current_month = now.getMonth()+1;
      that.data.current_year= current_year;
      that.data.current_month = current_month;
      that.data.monthNames=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
      if(app.globalData.birthday){
        that.data.months = that.populateData(year, month, current_year, current_month);
        that.data.currentIndex = that.getCurrentMonthIndex(app.globalData.birthday);
      } 
      that.measure();
      that.updateView();
      // console.log(that.data);
    });
  },

  onShow: function(){
    if(app.globalData.dirty){
      var year = app.globalData.birthday.getFullYear();
      var month = app.globalData.birthday.getMonth()+1;
      var now = new Date();
      var current_year = now.getFullYear();
      var current_month = now.getMonth()+1;
      this.data.months = this.populateData(year, month, current_year, current_month);
      this.updateView();
    }
  },

  scrolled: function(e){
    console.log(e.detail.deltaY)
    if(e.detail.deltaY>50){
      this.closeSelf();
    }
  }
})
