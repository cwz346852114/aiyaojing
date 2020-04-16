const api = getApp().globalData.api;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lie: "",
    list: [],
    load: true,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      lie: this.options.lie
    });
    if (this.options.lie == 1) {
      wx.request({
        url: api + "&r=sns.post.domestic_consumer",
        data: {
          id: that.options.id,
          page: 1,
          psize: 10
        },
        success(res) {
          console.log(res.data.list);
          that.setData({
            list: res.data.list
          });
        }
      });
      return false;
    }

    wx.request({
      url: api + "&r=sns.post.defriend_consumer",
      data: {
        id: that.options.id,
        page: 1,
        psize: 10
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          list: res.data.list
        });
      }
    });
  },
  quxiaojinyan(e) {
    var that = this;
    var openid = e.currentTarget.dataset.openid;
    console.log(openid);
    console.log(e);
    wx.request({
      url: api + "&r=sns.post.operationbanned",

      data: {
        boardid: that.options.id,
        openid: openid,
        deleted: 0
      },
      success(res) {
        wx.request({
          url: api + "&r=sns.post.domestic_consumer",
          data: {
            id: that.options.id,
            page: 1,
            psize: 10
          },
          success(res) {
            if (res.data.list) {
              that.setData({
                list: res.data.list
              });
              return false;
            }
            that.setData({
              list: []
            });
          }
        });
      }
    });
  },
  quxiaolahei(e) {
    var that = this;
    var openid = e.currentTarget.dataset.openid;
    console.log(openid);
    console.log(e);
    wx.request({
      url: api + "&r=sns.post.operationDefriend",

      data: {
        boardid: that.options.id,
        openid: openid,
        deleted: 0
      },
      success(res) {
        wx.request({
          url: api + "&r=sns.post.defriend_consumer",
          data: {
            id: that.options.id,
            page: 1,
            psize: 10
          },
          success(res) {
            if (res.data.list) {
              that.setData({
                list: res.data.list
              });
              return false;
            }
            that.setData({
              list: []
            });
          }
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

      if (this.options.lie == 1) {
        wx.request({
          url: api + "&r=sns.post.domestic_consumer",
          data: {
            id: that.options.id,
            page: that.data.page + 1,
            psize: 10
          },
          success(res) {
            wx.hideLoading();

            if (res.data.list && res.data.list.length > 0) {
              var content = that.data.list1.concat(res.data.list);
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
        return false;
      }

      wx.request({
        url: api + "&r=sns.post.defriend_consumer",
        data: {
          id: that.options.id,
          page: that.data.page + 1,
          psize: 10
        },
        success(res) {
          if (res.data.list && res.data.list.length > 0) {
            var content = that.data.list1.concat(res.data.list);
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
  }
});
