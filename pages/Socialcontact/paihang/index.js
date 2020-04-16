const openid = wx.getStorageSync("sessionkey").openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    my:"",
    approot:getApp().globalData.approot
  },
  toukan(e) {
    console.log(e)
    var openid = e.currentTarget.dataset.openid
    var id =  e.currentTarget.dataset.id
    wx.navigateTo({
      url:`/pages/Socialcontact/otherList/index?id=${id}&&openid=${openid}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    wx.request({
      url: getApp().globalData.api + "&r=pet.rankingList",
      data: {
        openid:openid,
        petid: that.options.id,
        page: 1,
        psize: 10
      },
      success(res) {
       
        that.setData({
          list: res.data.list,
          my:res.data.my
        });
        console.log(that.data.my)
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