Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    list: [],
    list1: [],
    opnid: "",
    tieId: "", //帖子Id
    actions: [],
    img: "/image/y-heart.png",
    img1: "/image/wheart.png",
    id: "",
    approot: "",
    zhiDingList: [], //置顶榜单
    DashenList: [], //大神榜单,
    checked: "",
    index: 0,
    load: true,
    page: 1
  },
  fangda(e) {
    var list = this.data.list1;
    var bindex = e.currentTarget.dataset.bindex;
    var index = e.currentTarget.dataset.index;
    let imgArr = [];

    for (var i = 0; i < list[bindex].images.length; i++) {
      imgArr[i] = this.data.approot + list[bindex].images[i].image;
    }
    console.log(imgArr);
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
    });
  },
  add() {
    const values = wx.getStorageSync("sessionkey");
    var id = this.options.id;
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.isAttention",
      data: {
        openid: values.openid,
        bid: id
      },
      success(res) {
        console.log(res.data);
        if (res.data.error == 0) {
          wx.navigateTo({
            url: `/pages/circle/addTie/index?id=${id}`
          });
          return false;
        }
        wx.showToast({
          title: res.data.message,
          icon: "none"
        });
      }
    });
  },
  //点赞帖子
  dianzan(e) {
    console.log()
    var that = this;
    const id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
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
        console.log();
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
  Togood(e) {
    console.log(e);
    var id = e.currentTarget.dataset.good_id;
    wx.navigateTo({
      url: `/pages/index/index?id=${id}`
    });
  },
  zanPin(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;

    var id = this.data.list1[index].post_comment_list.id;
    var isfavorite = this.data.list1[index].post_comment_list.deleted;
    console.log(isfavorite);
    var number = parseInt(this.data.list1[index].post_comment_list.zan_count);
    console.log(number);
    const row = `list1[${index}].post_comment_list.deleted`;
    const sum = `list1[${index}].post_comment_list.zan_count`;
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
  guanzhu() {
    var that = this;
    var isfavorite = this.data.list.isdeleted;

    isfavorite = !isfavorite;

    if (isfavorite) {
      isfavorite = 1;
    } else {
      isfavorite = 0;
    }
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.attentionBoard",
      data: {
        id: that.options.id,
        isfavorite: isfavorite,
        openid: values.openid
      },
      success(res) {
        that.setData({
          "list.isdeleted": res.data.isfavorite
        });
      }
    });
  },
  fenxiang(e) {
    this.setData({
      id: e.currentTarget.dataset.id
    });
  },

  //话题详情
  ToHuaDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tieDetail/index?id=${id}`
    });
  },
  //一级评论
  Topin1(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/shenping/index?id=${id}`
    });
  },
  //二级评论
  Topin2(e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.list1[index].post_comment_list.id;
    wx.navigateTo({
      url: `/pages/circle/pingDetail/index?id=${id}`
    });
  },
  onClick(e) {
    this.setData({
      index: e.detail.index
    });
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    var index = e.detail.index;
    var type = index == 0 ? "new" : "hot";
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.attentionPosts",
      data: {
        id: that.options.id,
        openid: values.openid,
        page: 1,
        type: type
      },
      success(res) {
        that.setData({
          list1: res.data.list
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.checkSession({
      success() {},
      fail() {
        wx.redirectTo({
          url: `/pages/login/login/index?datatype=5&&id=${options.id}`
        });
      }
    });
    this.setData({
      approot: getApp().globalData.approot
    });
  },
  Todashen() {
    var id = this.data.list.id;

    wx.navigateTo({
      url: `/pages/circle/god/index?id=${id}`
    });
  },
  huashiren() {
    var id = this.data.list.id;

    wx.navigateTo({
      url: `/pages/circle/admin/index?id=${id}`
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
      url: getApp().globalData.api + "&r=sns.post.attentionDetails",
      data: {
        id: that.options.id,
        openid: values.openid,
        page: 1
      },
      success(res) {
        that.setData({
          list: res.data
        });
      }
    });

    wx.request({
      url: getApp().globalData.api + "&r=sns.post.attentionPosts",
      data: {
        id: this.options.id,
        openid: values.openid,
        type: "new",
        page: 1
      },
      success(res) {
        that.setData({
          list1: res.data.list
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.stickPost",
      data: {
        boardid: that.options.id,
        openid: values.openid,
        page: 1,
        pagesize: 10
      },
      success(res) {
        console.log(res.data);
        that.setData({
          zhiDingList: res.data.list
        });
      }
    });
    //判断是否有显示操作按钮(帖子右上角点点点的图标)
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.authority",
      data: {
        boardid: that.options.id,
        openid: values.openid
      },
      success(res) {
        that.setData({
          checked: res.data.list
        });
        console.log(that.data.checked);
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.manitoList",
      data: {
        boardid: that.options.id,
        openid: values.openid,
        page: 1,
        pagesize: 10
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          DashenList: res.data.list
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

  onClose() {
    this.setData({ show: false });
  },
  kanshipin() {},
  ToChong(e) {
    var openid = e.currentTarget.dataset.openid;

    wx.navigateTo({
      url: `/pages/Socialcontact/otherList/index?openid=${openid}`
    });
  },
  onSelect(e) {
    var id = e.detail.id;
    var name = e.detail.name;
    var values = wx.getStorageSync("sessionkey");
    var that = this;

    if (id == 1) {
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.boardThingspeople",
        data: {
          id: that.options.id,
          openid: that.data.openid
        },
        success(res) {
          that.setData({
            show: false
          });
          that.onLoad();
        }
      });
      return false;
    }

    if (id == 2) {
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.operationDefriend",
        data: {
          boardid: that.options.id,
          openid: that.data.openid,
          deleted: 1
        },
        success(res) {
          that.setData({
            show: false
          });
          that.onLoad();
        }
      });
      return false;
    }
    if (id == 3) {
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.operationbanned",
        data: {
          boardid: that.options.id,
          openid: that.data.openid,
          deleted: 1
        },
        success(res) {
          console.log(res);
          that.setData({
            show: false
          });
          that.onLoad();
        }
      });
      return false;
    }
    if (id == 4) {
      wx.showModal({
        title: "提示",
        content: "是否确认删除",
        success(res) {
          if (res.confirm) {
            wx.request({
              url: getApp().globalData.api + "&r=sns.post.deletedpost",
              data: {
                postid: that.data.tieId,
                openid: that.data.openid
              },
              success(res) {
                console.log(res);
                that.setData({
                  show: false
                });
                wx.request({
                  url: getApp().globalData.api + "&r=sns.post.attentionPosts",
                  data: {
                    id: that.options.id,
                    openid: values.openid,
                    type: "new"
                  },
                  success(res) {
                    that.setData({
                      list1: res.data.list
                    });
                  }
                });
              }
            });
            return false;
          }
        }
      });
    }
    if (id == 5) {
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.operationStick",
        data: {
          postid: that.data.tieId,
          openid: that.data.openid,
          deleted: 1
        },
        success(res) {
          console.log(res);
          that.setData({
            show: false
          });
          that.onLoad();
        }
      });
      return false;
    }
  },
  shows(e) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.clickauthority",
      data: {
        postid: e.currentTarget.dataset.id,
        openid: values.openid
      },
      success(res) {
        that.setData({
          actions: res.data.list
        });
      }
    });
    this.setData({
      show: true,
      openid: e.currentTarget.dataset.openid,
      tieId: e.currentTarget.dataset.id
    });
  },
  onShareAppMessage(res) {
    console.log(res);
    var id = res.target.dataset.id;
    if (res.from === "button") {
      // 来自页面内转发按钮
      return {
        title: "爱妖精",
        path: "/pages/circle/tieDetail/index?id=" + id
      };
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    console.log(this.data.page);
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
      var type = this.data.index == 0 ? "new" : "hot";
      console.log(type);
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.attentionPosts",
        data: {
          openid: values.openid,
          type: type,
          page: that.data.page + 1
        },
        success(res) {
          wx.hideLoading();
          console.log(res);

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
