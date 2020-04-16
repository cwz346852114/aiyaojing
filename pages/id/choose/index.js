
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    qianzhui:"",
    key:"",
    page:1,
    load:true
  },
  shuru(e) {
    this.setData({
      key: e.detail.value
    });
  },
  sousuo() {
    var key = this.data.key.replace(" ", "");
    var that =this
    wx.request({
      url:getApp().globalData.api+"&r=pet.get_category",
     data:{
        page:1,
        pagesize:20,
        nationality_id:that.options.id,
        breed_name:key
      },
      success(res){
        if(res.data.list && res.data.list.length>0){
          that.setData({
            list:res.data.list
          })
          return false
        }
        that.setData({
          list:[]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      qianzhui:getApp().globalData.approot
    })
    var that = this
    wx.setStorage({
      key:"id",
      data:{
        nationality_id:options.id
      }
    })
    wx.request({
      url:getApp().globalData.api+"&r=pet.get_category",
     data:{
        page:1,
        pagesize:20,
        nationality_id:options.id
      },
      success(res){
       that.setData({
         list:res.data.list
       })
      }
    })
  },
  changeParent() {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData(); //触发父页面中的方法
    }
  },
  getId(e){
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var breed_name = this.data.list[index].breed_name
    var app = getApp()
    app.breed_name = breed_name
    app.id = id
    this.changeParent()
    wx.navigateBack({
     delta:1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
  
      wx.request({
        url:getApp().globalData.api + "&r=pet.get_category",
        method: "get",
        data: {
          page:that.data.page+1,
          pagesize:20,
          nationality_id:that.options.id
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          wx.hideLoading();
          if (res.data.list && res.data.list.length > 0) {
            var content = that.data.list.concat(res.data.list);
            //将放回结果放入content
            that.setData({
              load: true,
              list: content
            });
            that.data.page++;
          } else {
            wx.showToast({
              title: "已经到底了",
              icon: "error",
              duration: 2000
            });
            that.setData({
              load: true
            });
          }
        }
      });
    }
  },

 
})