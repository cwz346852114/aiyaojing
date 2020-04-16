const app = getApp();
const global = app.globalData;
var util = require("../../../utils/time.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list1: [],
    page: 1,
    load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: global.api + "&r=goods.remarkon.goodsRemarksList",
      data: {
        openid: options.openid,
        pet_id: options.id
      },
      success(res) {
        var list1 = res.data.list;

        for (let i = 0; i < list1.length; i++) {
          list1[i]["create_time"] = util.formatDate1(
            list1[i]["create_time"] * 1000
          );
        }
        that.setData({
          list1: list1
        });
      }
    });
  },
  toDetail(e) {
    const id = e.currentTarget.dataset.id;
    var list = this.data.list1[0];
    wx.navigateTo({
      url: `/pages/id/CommentDetail/index?id=${id}&&openid=${list.openid}`
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
        url: getApp().globalData.api + "&r=goods.remarkon.goodsRemarksList",
        data: {
          openid: that.options.openid,
          pet_id: that.options.id,
          page: that.data.page+1
        },
        success(res) {
          wx.hideLoading();

          if (res.data.list && res.data.list.length > 0) {
            var list1 = res.data.list;

            for (let i = 0; i < list1.length; i++) {
              list1[i]["create_time"] = util.formatDate1(
                list1[i]["create_time"] * 1000
              );
            }

            var content = that.data.list1.concat(list1);
            //将放回结果放入content
            that.setData({
              load: true,
              list1: content
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

  /**
   * 用户点击右上角分享
   */
});
