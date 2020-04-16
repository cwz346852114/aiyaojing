const openid = wx.getStorageSync("sessionkey").openid;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(openid)
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=pet.stealCannedLog",
      data: {
        petid: that.options.id,
        openid: openid,
        page: 1,
        psize: 10
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          list:res.data.list
        })
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

  /**
   * 用户点击右上角分享
   */

});
