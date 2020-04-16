// pages/search/detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    brandlist: [],
    petlist: [],
    good_list: [],
    approot: getApp().globalData.approot,
    key: "",
    page: 1,
    active: "",
    load: true,
    index: 0
  },
  clear() {
    this.setData({
      key: ""
    });
  },
  sousuo() {
    var key = this.data.key.replace(" ", "");
    var that = this;
    if (key != "") {
      //商品
      wx.request({
        url: getApp().globalData.api + "&r=goods.goodsearching",
        data: {
          key: key,
          page: that.data.page
        },
        success(res) {
          var list = res.data.goodlist;
          for (var i = 0; i < list.length; i++) {
            list[i].approot = that.data.approot;
            if (list[i].thumb.indexOf("https://img") != -1) {
              list[i].approot = "";
            }
          }

          that.setData({
            good_list: list
          });
        }
      });
      //品牌
      wx.request({
        url: getApp().globalData.api + "&r=goods.brandsearching",
        data: {
          key: key,
          page: that.data.page
        },
        success(res) {
          var list = res.data.brandlist;
          console.log(list);
          for (var i = 0; i < list.length; i++) {
            list[i].approot = that.data.approot;
            if (list[i].thumb.indexOf("https://img") != -1) {
              list[i].approot = "";
            }
          }
          that.setData({
            brandlist: list
          });
        }
      });
      //圈子
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.getboardlist",
        data: {
          keyword: key,
          page: that.data.page
        },
        success(res) {
          var list = res.data.list;

          that.setData({
            list: list
          });
        }
      });
      //用户
      wx.request({
        url: getApp().globalData.api + "&r=goods.petsearching",
        data: {
          key: key,
          page: that.data.page
        },
        success(res) {
          console.log(res.data);
          that.setData({
            petlist: res.data.petlist
          });
        }
      });
    }
  },
  shuru(e) {
    this.setData({
      key: e.detail.value
    });
  },
  clear() {
    this.setData({
      key: ""
    });
  },
  onChange(e) {
    var index = e.detail.index;
    var that = this;
    this.setData({
      page: 1,
      index: index
    });
    //商品
    wx.request({
      url: getApp().globalData.api + "&r=goods.goodsearching",
      data: {
        key: that.data.key,
        page: 1
      },
      success(res) {
        var list = res.data.goodlist;
        for (var i = 0; i < list.length; i++) {
          list[i].approot = that.data.approot;
          if (list[i].thumb.indexOf("https://img") != -1) {
            list[i].approot = "";
          }
        }

        that.setData({
          good_list: list
        });
      }
    });
    //品牌
    wx.request({
      url: getApp().globalData.api + "&r=goods.brandsearching",
      data: {
        key: that.data.key,
        page: 1
      },
      success(res) {
        var list = res.data.brandlist;
        console.log(list);
        for (var i = 0; i < list.length; i++) {
          list[i].approot = that.data.approot;
          if (list[i].thumb.indexOf("https://img") != -1) {
            list[i].approot = "";
          }
        }
        that.setData({
          brandlist: list
        });
      }
    });
    //圈子
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.getboardlist",
      data: {
        keyword: that.data.key,
        page: 1
      },
      success(res) {
        console.log(res.data);
        var list = res.data.list;

        that.setData({
          list: list
        });
      }
    });
    //用户
    wx.request({
      url: getApp().globalData.api + "&r=goods.petsearching",
      data: {
        key: that.data.key,
        page: 1
      },
      success(res) {
        console.log(res.data);
        that.setData({
          petlist: res.data.petlist
        });
      }
    });
  },
  ToShopping() {
    this.setData({
      active: 1
    });
  },
  Topinpai() {
    this.setData({
      active: 2
    });
  },
  Tohuati() {
    this.setData({
      active: 3
    });
  },
  Toyonghu() {
    this.setData({
      active: 4
    });
  },
  ToGood(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/index/index?id=${id}`
    });
  },
  ToPin(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/index/index?id=${id}`
    });
  },
  ToHua(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tiebalist/index?id=${id}`
    });
  },
  ToChong(e) {
    var id = e.currentTarget.dataset.id;
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: `/pages/Socialcontact/otherList/index?id=${id}&&openid=${openid}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      key: this.options.id
    });
    //商品
    wx.request({
      url: getApp().globalData.api + "&r=goods.goodsearching",
      data: {
        key: that.options.id
      },
      success(res) {
        var list = res.data.goodlist;
        for (var i = 0; i < list.length; i++) {
          list[i].approot = that.data.approot;
          if (list[i].thumb.indexOf("https://img") != -1) {
            list[i].approot = "";
          }
        }

        that.setData({
          good_list: list
        });
      }
    });
    //品牌
    wx.request({
      url: getApp().globalData.api + "&r=goods.brandsearching",
      data: {
        key: that.options.id
      },
      success(res) {
        var list = res.data.brandlist;
        console.log(list);
        for (var i = 0; i < list.length; i++) {
          list[i].approot = that.data.approot;
          if (list[i].thumb.indexOf("https://img") != -1) {
            list[i].approot = "";
          }
        }
        that.setData({
          brandlist: list
        });
      }
    });
    //圈子
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.getboardlist",
      data: {
        keyword: that.options.id
      },
      success(res) {
        console.log(res.data);
        var list = res.data.list;

        that.setData({
          list: list
        });
      }
    });
    //用户
    wx.request({
      url: getApp().globalData.api + "&r=goods.petsearching",
      data: {
        key: that.options.id
      },
      success(res) {
        console.log(res.data);
        that.setData({
          petlist: res.data.petlist
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
    var key = this.data.key.replace(" ", "");
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
    }
    if (this.data.index == 1) {
      wx.request({
        url: getApp().globalData.api + "&r=goods.goodsearching",
        data: {
          key: key,
          page: this.data.page + 1
        },
        success(res) {
          wx.hideLoading();
          if (res.data.goodlist && res.data.goodlist.length > 0) {
            var list = res.data.goodlist;

            for (var i = 0; i < list.length; i++) {
              list[i].approot = that.data.approot;
              if (list[i].thumb.indexOf("https://img") != -1) {
                list[i].approot = "";
              }
            }

            var content = that.data.good_list.concat(list);
            //将放回结果放入content
            that.setData({
              load: true,
              good_list: content
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
    if (this.data.index == 2) {
      wx.request({
        url: getApp().globalData.api + "&r=goods.brandsearching",
        data: {
          key: key,
          page: that.data.page + 1
        },
        success(res) {
          wx.hideLoading();
          if (res.data.brandlist && res.data.brandlist.length > 0) {
            var list = res.data.brandlist;
            for (var i = 0; i < list.length; i++) {
              list[i].approot = that.data.approot;
              if (list[i].thumb.indexOf("https://img") != -1) {
                list[i].approot = "";
              }
            }
            var content = that.data.brandlist.concat(list);
            that.setData({
              load: true,
              brandlist: content
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
    if (this.data.index == 3) {
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.getboardlist",
        data: {
          keyword: key,
          page: that.data.page + 1
        },
        success(res) {
          wx.hideLoading();
          if (res.data.list && res.data.list.length > 0) {
            var list = res.data.list;
            for (var i = 0; i < list.length; i++) {
              list[i].approot = that.data.approot;
              if (list[i].thumb.indexOf("https://img") != -1) {
                list[i].approot = "";
              }
            }
            var content = that.data.list.concat(list);
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
      return false;
    }
    if (this.data.index == 4) {
      wx.request({
        url: getApp().globalData.api + "&r=goods.petsearching",
        data: {
          key: key,
          page: that.data.page + 1
        },
        success(res) {
          wx.hideLoading();
          if (res.data.petlist && res.data.petlist.length > 0) {
            var list = res.data.petlist;
            for (var i = 0; i < list.length; i++) {
              list[i].approot = that.data.approot;
              if (list[i].thumb.indexOf("https://img") != -1) {
                list[i].approot = "";
              }
            }
            var content = that.data.petlist.concat(list);
            that.setData({
              load: true,
              petlist: content
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


});
