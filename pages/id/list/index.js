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
    post: "",
    shows:false,
    openlist:{}
  },
  jilu(){
    var id = this.data.list[0].id
    wx.navigateTo({
      url:`/pages/Socialcontact/jiLu/index?id=${id}`
    })
  },
  feedCannedLog(){
    var id = this.data.list[0].id
    wx.navigateTo({
      url:`/pages/Socialcontact/feedCannedLog/index?id=${id}`
    })
  },
  attentionPetCardSource(){
    var id = this.data.list[0].id
    wx.navigateTo({
      url:`/pages/Socialcontact/attentionPetCardSource/index?id=${id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    
    this.setData({
      post: getApp().globalData.approot
    });
    if(values.openid){
      this.setData({
        openid:values.openid
      })
    }else{
      this.setData({
        openid:""
      })
    }
    wx.request({
      url: getApp().globalData.api + "&r=member",
      data: {
        openid: values.openid
      },
      success(res) {
        console.log(res.data)
        that.setData({
          openlist: res.data
        });
      }
    });
    wx.request({
      url: global.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
        if (that.data.list.length > 0) {
          wx.request({
            url: global.api + "&r=pet.getPetFoodCan",
            data: {
              frompetid: that.data.list[0].id,
              openid: values.openid,
              topetid: that.data.list[0].id
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

          wx.request({
            url: global.api + "&r=goods.remarkon.goodsRemarksList",
            data: {
              openid: values.openid,
              pet_id: that.data.list[0].id
            },
            success(res) {
              var list1 = res.data.list;
              console.log(res.data.list)

              that.setData({
                list1: list1
              });
            }
          });
          wx.request({
            url: global.api + "&r=goods.remarkon.GoodsPhotoAlbumList",
            data: {
              openid: values.openid,
              pet_id: that.data.list[0].id
            },
            success(res) {
              console.log(res.data);
              that.setData({
                list2: res.data.list
              });
            }
          });
        }
      }
    });
  },
  add() {
    wx.navigateTo({
      url: "/pages/id/headPortrait/index"
    });
  },
  allPing() {
    var list = this.data.list[0]

    wx.navigateTo({
      url: `/pages/id/CommentList/index?id=${list.id}&&openid=${list.openid}`
    });
  },
  allXie() {
    var list = this.data.list[0]
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
    console.log(this.data.list1)
    var list = this.data.list1[0]
    console.log()
    wx.navigateTo({
      url: `/pages/id/CommentDetail/index?id=${id}&&openid=${list.openid}`
    });
  },
  select(e) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    this.setData({
      col: e.currentTarget.dataset.index
    });
    wx.request({
      url: global.api + "&r=pet.update_default",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: values.openid,
        id: e.currentTarget.dataset.id
      },
      success() {
        wx.request({
          url: getApp().globalData.api + "&r=pet.get_list",
          data: {
            openid: values.openid
          },
          success(res) {
            that.setData({
              list: res.data.list
            });
            wx.request({
              url: global.api + "&r=pet.getPetFoodCan",
              data: {
                frompetid: that.data.list[0].id,
                openid: values.openid,
                topetid: that.data.list[0].id
              },
              success(res) {
                that.setData({
                  petFoodCantotal:
                    res.data.petFoodCantotal == null
                      ? 0
                      : res.data.petFoodCantotal,
                  zan_count: res.data.zan_count
                });
              }
            });
            wx.request({
              url: global.api + "&r=goods.remarkon.GoodsPhotoAlbumList",
              data: {
                openid: values.openid,
                pet_id: that.data.list[0].id
              },
              success(res) {
                that.setData({
                  list2: res.data.list
                });
              }
            });
            wx.request({
              url: global.api + "&r=goods.remarkon.goodsRemarksList",
              data: {
                openid: values.openid,
                pet_id: that.data.list[0].id
              },
              success(res) {
                var list1 = res.data.list;
             
                that.setData({
                  list1: list1
                });
                wx.setStorage({
                  key: "shuaxin",
                  data: 1
                });
              }
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
  onShareAppMessage(res) {
    var openid = wx.getStorageSync("sessionkey").openid

      return {
        title: "爱妖精",
        path: "/pages/Socialcontact/otherList/index?openid=" + openid
      };
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var shuaxin = wx.getStorageSync("shuaxin");

    var values = wx.getStorageSync("sessionkey");
    var that = this;
    if (shuaxin == 2) {
      wx.request({
        url: global.api + "&r=pet.get_list",
        data: {
          openid: values.openid
        },
        success(res) {
          that.setData({
            list: res.data.list
          });
          wx.request({
            url: global.api + "&r=goods.remarkon.goodsRemarksList",
            data: {
              openid: values.openid,
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
        }
      });
      wx.request({
        url: global.api + "&r=pet.get_list",
        data: {
          openid: values.openid
        },
        success(res) {
          that.setData({
            list: res.data.list
          });
          wx.request({
            url: global.api + "&r=goods.remarkon.GoodsPhotoAlbumList",
            data: {
              openid: values.openid,
              pet_id: that.data.list[0].id
            },
            success(res) {
              var list2 = res.data.list;
              for (let i = 0; i < list2.length; i++) {
                list2[i]["create_time"] = util.formatDate1(
                  list2[i]["create_time"] * 1000
                );
              }
              that.setData({
                list2: list2
              });
            }
          });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  onClose1(){
    this.setData({
      shows:false
    })
  },
  tankuang(){
    this.setData({
      shows:true
    })
  },
  login(){
    wx.navigateTo({
      url:"/pages/login/login/index"
    })
  },
  


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
  },
  edit(e) {
    wx.navigateTo({
      url: `/pages/id/editHead/index?id=${e.currentTarget.dataset.id}`
    });
  }
});
