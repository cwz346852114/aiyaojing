// pages/shopping/shopDetail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    approot: ""
  },
  fangda(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let imgArr = [];
    for (var i = 0; i < this.data.list.length; i++) {
  
        //找到图片所在的数组
        imgArr[i] = this.data.approot+this.data.list[i].g_url;
      
    }
    wx.previewImage({
      current: imgArr[id],
      urls: [imgArr]
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      approot: getApp().globalData.approot,
      id: options.id
    });
    //图片
    console.log(options)
    if (options.id == 1) {
      wx.request({
        url: getApp().globalData.api + "&r=photoandvideo.goodsimages",
        data: {
          page: 1,
          goodid: that.options.goodid
        },
        success(res) {
          var list = res.data.list;
          for (let i = 0; i < list.length; i++) {
            list[i].approot = that.data.approot;
            if (list[i].g_url.indexOf("https://img2") != -1) {
              list[i].approot = "";
            }
          }
          console.log(list);
          that.setData({
            list: list
          });
        }
      });
      return false;
    }
    // 视频
    wx.request({
      url: getApp().globalData.api + "&r=photoandvideo.goodsvideo",
      data: {
        page: 1,
        goodid: that.options.goodid
      },
      success(res) {
        console.log(res.data.list)
        var list = res.data.list;

        that.setData({
          list: list
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
