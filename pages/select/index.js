// pages/select/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qianzhui: "",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      qianzhui: getApp().globalData.approot
    });
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
      }
    });
  },
  getId(e) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;

    wx.request({
      url: getApp().globalData.api + "&r=pet.update_default",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: values.openid,
        id: e.currentTarget.dataset.id
      },
      success() {
        wx.reLaunch({
          url: "/pages/home/index"
        });
      }
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

});
