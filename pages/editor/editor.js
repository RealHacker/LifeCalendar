var app = getApp()
Page({
    data: {},
    formSubmit: function(e){
        var year = app.globalData.selected_year;
        var month = app.globalData.selected_month;
        var key = ""+year+""+month;

        var formData = e.detail.value;
        // update global data
        var months = app.globalData.months || {};
        
        var dirty = false;
        if(!month[key]|| months[key].mood != formData.happiness) {
            dirty= true;
        }
        months[key].mood = formData.happiness;
        var events = [];
        if(formData.item0!=null&&formData.item0!="") events.push(formData.item0);
        if(formData.item1!=null&&formData.item1!="") events.push(formData.item1);
        if(formData.item2!=null&&formData.item2!="") events.push(formData.item2);
        if(!months[key]){
            if(events.length>0){
                dirty = true;
            } 
        } else {
            if(events.length != months[key].events.length){
                dirty = true;
            } else {
                for(var i=0;i<events.length;i++){
                    if(events[i] != months[key].events[i])
                        dirty= true;
                }
            }
        }
        months[key].events = events;

        //update persistent data
        var storage = wx.getStorageSync('months')||{};
        if(!storage[key]){
            storage[key] = {
                year: year,
                month: month
            }
        }
        storage[key].mood = formData.happiness;
        storage[key].events = events;
        wx.setStorageSync('months', storage);

        app.globalData.dirty = dirty;
        this.closeEditor();
    },
    cancel: function(){
        app.globalData.dirty = false;
        this.closeEditor();
    },
    closeEditor: function(){
        wx.navigateBack({
          delta: 1// 回退前 delta(默认为1) 页面
        })
    },
    onLoad: function(){
        var year = app.globalData.selected_year;
        var month = app.globalData.selected_month;
        wx.setNavigationBarTitle({title:""+year+"年"+month+"月"});
        var key = ""+year+""+month;
        this.data = app.globalData.months[key];
        this.setData(this.data);
    }
});