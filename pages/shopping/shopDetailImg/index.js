Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    list: [],
    approot: "",
    list1: [],
    videoList: [],
    videoList1: []
  },
  img() {
    this.setData({
      show: true
    });
  },
  video() {
    this.setData({
      show: false
    });
  },
  Toqqiang1() {
    var id = this.options.id;
    wx.navigateTo({
      url: `/pages/shopping/shopDetail/index?id=1&&goodid=${id}`
    });
  },
  Toqqiang2() {
    var id = this.options.id;
    wx.navigateTo({
      url: `/pages/shopping/shopDetail/index?id=2&&goodid=${id}`
    });
  },

  fangda1(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let imgArr = [];
    for (var i = 0; i < this.data.list.length; i++) {
      imgArr[i] = this.data.approot + this.data.list[i].g_url;
    }
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
    });
  },
  fangda(e) {
    console.log(e);

    let index = e.currentTarget.dataset.index;
    let imgArr = [];
    for (var i = 0; i < this.data.list1.length; i++) {
      imgArr[i] =this.data.list1[i].r_url;
    }
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      approot: getApp().globalData.approot
    });
    wx.request({
      url: getApp().globalData.api + "&r=photoandvideo.goodsimages",
      data: {
        page: 1,
        goodid: that.options.id
      },
      success(res) {
        var list = res.data.list;
        for (var i = 0; i < list.length; i++) {
          list[i].approot = that.data.approot;
          if (list[i].g_url.indexOf("https://img2.epetbar.com") != -1) {
            list[i].approot = "";
          }
        }
        that.setData({
          list: list
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=photoandvideo.remarkimages",
      data: {
        page: 1,
        goodid: that.options.id
      },
      success(res) {
        console.log(res.data);
        var list = res.data.list;
        for (var i = 0; i < list.length; i++) {
          list[i].r_url = that.data.approot + list[i].r_url;
        }
        that.setData({
          list1: list
        });
      }
    });
    //品论视频
    wx.request({
      url: getApp().globalData.api + "&r=photoandvideo.remarkvideo",
      data: {
        page: 1,
        goodid: that.options.id
      },
      success(res) {
        console.log(res.data);
        that.setData({
          videoList: res.data.list
        });
      }
    });
    //商品视频
    wx.request({
      url: getApp().globalData.api + "&r=photoandvideo.goodsvideo",
      data: {
        page: 1,
        goodid: that.options.id
      },
      success(res) {
        console.log(res.data);
        that.setData({
          videoList1: res.data.list
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


  routeDetail() {
    wx.navigateTo({
      url: "/pages/shopping/shopDetail/index"
    });
  }
});
