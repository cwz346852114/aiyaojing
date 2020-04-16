const openid = wx.getStorageSync("sessionkey").openid;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    imgUrls: [],
    approot: getApp().globalData.approot,
    times: [],
    goodlist: [],
    index:0,
    page:1,
    load:true,
    id:""
  },
  bindChange: function(e) {
    var that = this;
    console.log( e.currentTarget.dataset.current)
    that.setData({ currentTab: e.currentTarget.dataset.current });
  },
  /** * 点击tab切换  */
  swichNav: function(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    var index =  e.currentTarget.dataset.index
    this.setData({
      index:index,
      page:1,
      id:id
    })
    var data = this.data.data;
    if (this.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      console.log(e.currentTarget.dataset.current);
      that.setData({
        currentTab: e.currentTarget.dataset.current
      });
    }
    console.log(this.data.currentTab);
    wx.request({
      url: getApp().globalData.api + "&r=seckill.get_goods",
      data: {
        taskid: data.taskid,
        roomid: data.roomid,
        timeid: id
      },
      success(res) {
        console.log(res.data.goods)
        that.setData({
          goodlist: res.data.goods
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /** * 获取系统信息  */
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=seckill.get_list",
      data: {},
      success(res) {
        console.log(res.data);
        that.setData({
          times: res.data.times,
          data: res.data
        });
        that.goodList();
        that.getSwiper()
      }
    });
  },
  goodList(e) {
    var that = this;
    var data = this.data.data;
    wx.request({
      url: getApp().globalData.api + "&r=seckill.get_goods",
      data: {
        taskid: data.taskid,
        roomid: data.roomid,
        timeid: data.timeid
      },
      success(res) {
        that.setData({
          goodlist: res.data.goods
        });
      }
    });
  },
  getSwiper(){
    var that = this
    wx.request({
      url: getApp().globalData.api  + "&r=shop.index.get_adv_list",
      data: {
        location: 4
      },
      success(res) {
        
        that.setData({
          imgUrls: res.data.data
        });
      }
    });
  },
  //去抢购
  ToKan(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:`/pages/fenxiao/Detail/index?id=${id}&&type=4`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (getApp().globalData.currentLocation == "") {
      this.setData({
        currentTab: 0
      });
    } else {
      var i = getApp().globalData.currentLocation;
      this.setData({
        currentTab: i
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var data = this.data.data;
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      this.setData({
        load: false
      });
      var that = this
      var values = wx.getStorageSync("sessionkey")
  
      wx.request({
        url: getApp().globalData.api + "&r=seckill.get_goods",
        method: "get",
        data: {
          taskid: data.taskid,
          roomid: data.roomid,
          timeid: that.data.id
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          wx.hideLoading();

          if (res.data.list && res.data.list.length > 0) {
            var content = that.data.goodlist.concat(res.data.list);
            //将放回结果放入content
            that.setData({
              load: true,
              goodlist: content
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


});
