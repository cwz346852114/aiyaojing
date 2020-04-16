// pages/my/bargaining/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
   
    load: true,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=bargain.all",
      data: {
        page: 1,
        openid: values.openid
      },
      success(res) {
        console.log(res.data);
        that.setData({
          list: res.data.list
        });
      }
    });
  },
  ToDetail(e){
    console.log(e)
    var goods_id = e.currentTarget.dataset.goods_id
    var id = e.currentTarget.dataset.id

    wx.navigateTo({
      url:`/pages/kanjia/listDetail/index?id=${goods_id}&&actor_id=${id}`
    })
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
  onReachBottom: function() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
      wx.request({
        url: getApp().globalData.api + "&r=bargain.all",
        data: {
          page: that.data.page+1,
          openid: values.openid
        },
        success(res) {
          wx.hideLoading();
          console.log(res);

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
  }
});
