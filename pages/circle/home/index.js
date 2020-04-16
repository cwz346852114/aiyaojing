// pages/circle/home/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    list: [],
    apolosize: "",
    list1: [],
    img: "/image/y-heart.png",
    img1: "/image/wheart.png",
    load: true,
    page: 1,
    index: 0,
    shows: false,
    openid: "",
    petlist: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    if (values.openid) {
      this.setData({
        openid: values.openid
      });
    } else {
      this.setData({
        openid: ""
      });
    }
    this.setData({
      apolosize: getApp().globalData.approot
    });
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.postListPlaza",
      data: {
        openid: values.openid,
        page: 1
      },
      success(res) {
        that.setData({
          show: false,
          list1: res.data.list
        });
      }
    });
  },
  fangda(e) {
    var list = this.data.list1;
    var bindex = e.currentTarget.dataset.bindex;
    var index = e.currentTarget.dataset.index;
    let imgArr = [];

    for (var i = 0; i < list[bindex].images.length; i++) {
      imgArr[i] = this.data.apolosize + list[bindex].images[i].image;
    }
    console.log(imgArr);
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
    });
  },
  ToChong(e) {
    var openid = e.currentTarget.dataset.openid;

    wx.navigateTo({
      url: `/pages/Socialcontact/otherList/index?openid=${openid}`
    });
  },
  pinzan(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;

    var id = this.data.list1[index].comment_list[0].id;
    var isfavorite = this.data.list1[index].comment_list[0].deleted;

    var number = parseInt(this.data.list1[index].comment_list[0].zan_count);

    const row = `list1[${index}].comment_list[0].deleted`;
    const sum = `list1[${index}].comment_list[0].zan_count`;
    isfavorite = !isfavorite;
    if (isfavorite) {
      isfavorite = 1;
    } else if (!isfavorite) {
      isfavorite = 0;
    }

    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.fabulousComment",
      data: {
        id: id,
        isfavorite: isfavorite,
        openid: values.openid
      },
      success(res) {
        that.setData({
          [row]: res.data.isfavorite
        });

        if (res.data.isfavorite) {
          number = number + 1;
          that.setData({
            [sum]: number
          });
        } else {
          number = number - 1;
          that.setData({
            [sum]: number
          });
        }
      }
    });
  },
  like(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tiebalist/index?id=${id}`
    });
  },
  shenping(e) {
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: `/pages/circle/pingDetail/index?id=${id}`
    });
  },
  ToQuan(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: `/pages/circle/tiebalist/index?id=${id}`
    });
  },
  ToGoods(e) {
    var id = e.currentTarget.dataset.good_id;
    wx.navigateTo({
      url: `/pages/index/index?id=${id}`
    });
  },
  TieDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tieDetail/index?id=${id}`
    });
  },
  sousuo() {
    wx.navigateTo({
      url: "/pages/search/result/index?id=2"
    });
  },

  tiezan(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(e);
    var id = this.data.list1[index].id;
    var isfavorite = this.data.list1[index].deleted;

    var number = parseInt(this.data.list1[index].zan_count);

    const row = `list1[${index}].deleted`;
    const sum = `list1[${index}].zan_count`;
    isfavorite = !isfavorite;
    if (isfavorite) {
      isfavorite = 1;
    } else if (!isfavorite) {
      isfavorite = 0;
    }

    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.fabulousPost",
      data: {
        id: id,
        isfavorite: isfavorite,
        openid: values.openid
      },
      success(res) {
        that.setData({
          [row]: res.data.isfavorite
        });

        if (res.data.isfavorite) {
          number = number + 1;
          that.setData({
            [sum]: number
          });
        } else {
          number = number - 1;
          that.setData({
            [sum]: number
          });
        }
      }
    });
  },
  onClick(e) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    //
    this.setData({
      index: e.detail.index
    });
    if (e.detail.index == 1 && this.data.show == false) {
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.getMelist",
        data: {
          openid: values.openid
        },
        success(res) {
          that.setData({
            show: true,
            list: res.data
          });
        }
      });
      return false;
    }
    //广场接口
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.postListPlaza",
      data: {
        openid: values.openid,
        page: 1
      },
      success(res) {
        that.setData({
          show: false,
          list1: res.data.list
        });
      }
    });
  },
  //去我的圈子
  ToMy(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tiebalist/index?id=${id}`
    });
  },
  add() {
    if (this.data.list.mylist.length > 0) {
      wx.navigateTo({
        url: "/pages/circle/addCircle/index"
      });
      return false;
    }
    wx.navigateTo({
      url: "/pages/circle/yindao/index"
    });
  },
  //去关注的圈子
  ToGuan(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tiebalist/index?id=${id}`
    });
  },
  ToCircleDetail() {
    var id = 1;
    wx.navigateTo({
      url: `/pages/circle/circlelist/index?id=${id}`
    });
  },
  ToGuanDetail() {
    var id = 2;
    wx.navigateTo({
      url: `/pages/circle/circlelist/index?id=${id}`
    });
  },
  ToGengduo() {
    var id = 3;
    wx.navigateTo({
      url: `/pages/circle/circlelist/index?id=${id}`
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
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.getMelist",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          show: true,
          list: res.data
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
  onPullDownRefresh: function() {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    //广场接口
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.postListPlaza",
      data: {
        openid: values.openid,
        page: 1
      },
      success(res) {
        that.setData({
          show: false,
          list1: res.data.list
        });
      }
    });
   
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.getMelist",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          show: true,
          list: res.data
        });
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(this.data.index);

    var that = this;
    var values = wx.getStorageSync("sessionkey");
    if (this.data.index == 0) {
      wx.showLoading({
        title: "加载中"
      });
      if (this.data.load) {
        that.setData({
          load: false
        });

        wx.request({
          url: getApp().globalData.api + "&r=sns.post.getMelist",
          data: {
            openid: values.openid,
            page: that.data.page + 1
          },
          success(res) {
            wx.hideLoading();
            console.log(res);

            if (res.data && res.data.length > 0) {
              var content = that.data.list1.concat(res.data);
              //将放回结果放入content
              that.setData({
                list1: content
              });
              that.data.page++;
            } else {
              wx.showToast({
                title: "已经到底了",
                icon: "error",
                duration: 2000
              });
            }
            that.setData({
              load: true
            });
          }
        });
      }
    }
  },
  fenxiang() {},
  onShareAppMessage(res) {
    var id = res.target.dataset.id;
    console.log(res);
    if (res.from === "button") {
      // 来自页面内转发按钮
      return {
        title: "爱妖精",
        path: "/pages/circle/tieDetail/index?id=" + id
      };
    }
  },
  onClose1() {
    this.setData({
      shows: false
    });
  },
  tankuang() {
    this.setData({
      shows: true
    });
  },
  login() {
    wx.navigateTo({
      url: "/pages/login/login/index"
    });
  }
});
