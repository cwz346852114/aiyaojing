const app = getApp();
const global = app.globalData;
var util = require("../../../utils/time.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    value: 3,
    show: false,
    list: [],
    list1: [],
    list2: [],
    img: "/image/idcard/xin.png",
    img1: "/image/idcard/grey.png",
    post: "",
    petFoodCantotal: 0,
    isfavorite: "",
    zan_count: "",
    myId: [],
    image: "/image/idcard/dianzan1.png",
    image1: "/image/idcard/dianzan.png",
    openlist: {},
    bindex:0
  },
  dianzan(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    var values = wx.getStorageSync("sessionkey");
    var isfavorite = this.data.list[index].deleted;
    isfavorite = !isfavorite;

    if (isfavorite) {
      isfavorite = 1;
    } else if (!isfavorite) {
      isfavorite = 0;
    }

    var values = wx.getStorageSync("sessionkey");
    //关注宠物卡
    wx.request({
      url: global.api + "&r=pet.attentionPetCard",
      data: {
        frompetid: that.data.myId[0].id,
        isfavorite: isfavorite,
        topetid: that.data.list[index].id,
        openid: values.openid
      },
      success(res) {
        wx.request({
          url: global.api + "&r=pet.get_list",
          data: {
            openid: that.options.openid,
            id: that.options.id ? that.options.id : "",
            from_openid: values.openid
          },
          success(res) {
            that.setData({
              list: res.data.list
            });
            if (that.data.list.length > 0) {
              wx.request({
                url: global.api + "&r=pet.getPetFoodCan",
                data: {
                  frompetid: that.data.myId[0].id,
                  openid: that.options.openid,
                  topetid: that.data.list[index].id
                },
                success(res) {
                  that.setData({
                    petFoodCantotal:
                      res.data.petFoodCantotal == null
                        ? 0
                        : res.data.petFoodCantotal,
                    zan_count: res.data.zan_count,
                    feed: res.data.feed
                  });
                }
              });
            }
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey")
    //判断是不是分享人点进来的
    if(values.openid == options.openid){
      wx.reLaunch({
        url:"/pages/id/list/index"
      })
    }
    wx.checkSession({
      success() {},
      fail() {
        wx.redirectTo({
          url: `/pages/login/login/index?datatype=11&&openid=${options.openid}`
        });
      }
    });
  },

  allPing() {
    var list = this.data.list[0];

    wx.navigateTo({
      url: `/pages/id/CommentList/index?id=${list.id}&&openid=${list.openid}`
    });
  },
  allXie() {
    var list = this.data.list[0];
    wx.navigateTo({
      url: `/pages/id/photoList/index?openid=${list.openid}`
    });
  },
  toPhoto(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/id/PhotoDetail/index?id=${id}`
    });
  },
  toDetail(e) {
    const id = e.currentTarget.dataset.id;
    var list = this.data.list1[0];
    wx.navigateTo({
      url: `/pages/id/CommentDetail/index?id=${id}&&openid=${list.openid}`
    });
  },
  select(e) {
    if(this.options.id){
      return false
    }
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    this.setData({
      col: e.currentTarget.dataset.index
    });
    var index = e.currentTarget.dataset.index;
    this.setData({
      bindex:index
    })
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: that.options.openid,
        from_openid: values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
        wx.request({
          url: global.api + "&r=pet.getPetFoodCan",
          data: {
            frompetid: that.data.myId[0].id,
            openid: values.openid,
            topetid: that.data.list[index].id
          },
          success(res) {
            that.setData({
              petFoodCantotal:
                res.data.petFoodCantotal == null ? 0 : res.data.petFoodCantotal,
              zan_count: res.data.zan_count
            });
          }
        });
        wx.request({
          url: global.api + "&r=goods.remarkon.goodsRemarksList",
          data: {
            openid: that.options.openid,
            pet_id: that.data.list[index].id
          },
          success(res) {
            var list1 = res.data.list;

            if (res.data.list && res.data.list.length > 0) {
              for (let i = 0; i < list1.length; i++) {
                list1[i]["create_time"] = util.formatDate1(
                  list1[i]["create_time"] * 1000
                );
              }
              that.setData({
                list1: list1
              });
              wx.setStorage({
                key: "shuaxin",
                data: 1
              });
            }
          }
        });
        wx.request({
          url: global.api + "&r=goods.remarkon.GoodsPhotoAlbumList",
          data: {
            openid: that.options.openid,
            pet_id: that.data.list[index].id
          },
          success(res) {
            if (res.data.list && res.data.list.length > 0) {
              that.setData({
                list2: res.data.list
              });
            }
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
  onShow: function() {

    var that = this;
    var values = wx.getStorageSync("sessionkey");
    this.setData({
      post: getApp().globalData.approot
    });
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=member",
      data: {
        openid: that.options.openid
      },
      success(res) {
        that.setData({
          openlist: res.data
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: values.openid,
        page: 1,
        pagesize: 10
      },
      success(res) {
        if (res.data.list && res.data.list.length > 0) {
          that.setData({
            myId: res.data.list
          });
        }

        wx.request({
          url: global.api + "&r=pet.get_list",
          data: {
            openid: that.options.openid,
            id: that.options.id ? that.options.id : "",
            from_openid: values.openid
          },
          success(res) {
            that.setData({
              list: res.data.list
            });
            if (that.data.list.length > 0) {
              wx.request({
                url: global.api + "&r=pet.getPetFoodCan",
                data: {
                  frompetid: that.data.myId[0].id,
                  openid: that.options.openid,
                  topetid: that.data.list[0].id
                },
                success(res) {
                  that.setData({
                    petFoodCantotal:
                      res.data.petFoodCantotal == null
                        ? 0
                        : res.data.petFoodCantotal,
                    zan_count: res.data.zan_count,
                    feed: res.data.feed,
                    isfavorite: res.data.deleted
                  });
                }
              });
              wx.request({
                url: global.api + "&r=goods.remarkon.goodsRemarksList",
                data: {
                  openid: that.options.openid,
                  pet_id: that.data.list[0].id
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
              wx.request({
                url: global.api + "&r=goods.remarkon.GoodsPhotoAlbumList",
                data: {
                  openid: that.options.openid,
                  pet_id: that.data.list[0].id
                },
                success(res) {
                  that.setData({
                    list2: res.data.list
                  });
                }
              });
            }
          }
        });
      }
    });
  },

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

  onChange(event) {
    if (event.detail.index == 0) {
      this.setData({
        show: false
      });
    } else {
      this.setData({
        show: true
      });
    }
  }
});
