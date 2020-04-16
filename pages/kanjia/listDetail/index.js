
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    share: "",
    list1: "",
    bargain: "",
    bargain_price: 0,
    time: 0,
    timeData: {},
    id: "",
    mid: "",
    actor_id: "",
    layer: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    wx.checkSession({
      success() {  
      },
      fail() {
       wx.redirectTo({
           url:`/pages/login/login/index?datatype=9&&actor_id=${options.actor_id}&&id=${options.id}`
       })
      }
    });
  
    this.initData();
  },
  initData() {
    var that = this
    var values = wx.getStorageSync('sessionkey')
    wx.request({
      url: getApp().globalData.api + "&r=bargain.bargain",
      data: {
        openid: values.openid,
        id: that.options.id,
        actor_id: that.options.actor_id ? that.options.actor_id : ""
      },
      success(res) {
     
        that.setData({
          list1: res.data.list,
          share: res.data.share,
          bargain_price: parseFloat(res.data.list.bargain_price),
          list: res.data.bargain_record,
          bargain: res.data.bargain,
          id: res.data.bargain.id,
          actor_id: res.data.actor_id,
          swi: res.data.swi,
          trade_swi: res.data.trade_swi,
          myself_swi: res.data.myself_swi,
          arrived: res.data.arrived,
          timeout: res.data.timeout,
          time: (res.data.bargain.end_time - res.data.bargain.nowtime) * 1000,
          new_price: parseFloat( res.data.list.now_price-res.data.bargain.end_price).toFixed(2)
        });
      }
    });
  },
  onChange(e) {
    this.setData({
      timeData: e.detail
    });
  },
  pay() {
    var id = this.data.actor_id;
    wx.navigateTo({
      url: `/pages/order/list/index?id=${id}&&type=1`
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */

  seekHelp: function() {
    this.onShareAppMessage();
  },
  onShareAppMessage: function(a) {
    var values = wx.getStorageSync('sessionkey')
    var i = this;
    return {
      title: "帮砍价",
      path:
        "/pages/kanjia/listDetail/index?id=" +
        i.data.id +
        "&actor_id=" +
        i.data.actor_id +
        "&openid=" +
        values.openid,
      success: function(a) {},
      fail: function(a) {}
    };
  },
  //我也要砍
  kan() {
    wx.navigateTo({
      url: `/pages/kanjia/list/index`
    });
  },
  //帮砍一刀
  cutPrice() {
    var that = this;
    var values = wx.getStorageSync("sessionkey")
    wx.request({
      url: getApp().globalData.api + "&r=bargain.bargain",
      data: {
        openid:values.openid,
        id: that.options.id,
        ajax: 151,
        actor_id: that.data.actor_id
      },
      success(res) {
        var list = JSON.stringify(res.data.cutPrice);
          console.log(res.data)
        if (res.data.error == 0) {
          wx.showToast({
            title: "您砍了" + list + "元",
            icon: "none"
          });
          that.initData();
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          });
        }
      }
    });
  }
});
