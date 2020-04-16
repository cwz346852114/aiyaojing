// pages/pintuan/Detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    image: [],
    show:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    wx.checkSession({
      success() {},
      fail() {
        wx.redirectTo({
          url: `/pages/login/login/index?datatype=10&&teamid=${options.teamid}`
        });
      }
    });

    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=groups.team.details",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: values.openid,
        teamid: options.teamid
      },
      success(res) {
        console.log(res.data.data)
        if(res.data.data.tuan_first_order.success==1){
          that.setData({
            show:false
          })
        }
        that.setData({
    
          list: res.data.data,
          time:
            (res.data.data.tuan_first_order.endtime - res.data.data.now_time) * 1000,
          groupnum: res.data.data.tuan_first_order.groupnum
        });
        var image = res.data.data.orders;
        var imgs = [];
        var pic = "/image/toux_tianjia.png";
        for (var i = 0; i < res.data.data.tuan_first_order.groupnum; i++) {
          if (image[i] && image[i].avatar) {
            imgs.push(image[i].avatar);
          } else {
            imgs.push(pic);
          }
        }
        that.setData({
          image:imgs
        })
      }
    });
  },
  lijicantuan() {
    var that = this;
    var id = this.data.list.goods.id;
    wx.navigateTo({
      url: `/pages/order/list/index?type=3&&id=${id}&&heads=0&&teamid=${that.options.teamid}`
    });
  },
  onChange(e) {
    this.setData({
      timeData: e.detail
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
  onShareAppMessage: function() {}
});
