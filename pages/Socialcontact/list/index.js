const openid = wx.getStorageSync("sessionkey").openid

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    approot:getApp().globalData.approot
  },
  touguantou(e) {
    var id = e.currentTarget.dataset.id;
    var openid =  e.currentTarget.dataset.openid;
    console.log(e)
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=pet.stealCanned",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        frompetid:that.options.id,//自己的宠物id
        topetid:id,//偷取的宠物id
        fromopenid:values.openid,//自己的openid
        toopenid:openid,//偷取的openid
      },
      success(res){
        if(res.data.error!=0){
          wx.showToast({
            title:res.data.message,
            icon:"none"
          })
          return false
        }
        wx.showToast({
          title:res.data.message,
          icon:"none"
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
 
    wx.request({
      url: getApp().globalData.api + "&r=pet.attentionPetCardList",
      data: {
        openid:openid,
        petid:that.options.id,
        page: 1,
        psize: 10
      },
      success(res) {
        var list1 = res.data.list;
        that.setData({
          list: list1
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