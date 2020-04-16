// pages/my/kefu/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    approot:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      approot:getApp().globalData.approot
    })
    var that = this
    wx.request({
      url: getApp().globalData.api + "&r=shop.index.get_adv_list",
      data: {
        location: 7
      },
      success(res) {
        console.log(res.data)
        that.setData({
          list: res.data.data
        });
      }
      
    });
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

  },


})