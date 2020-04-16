const openid = wx.getStorageSync("sessionkey").openid;
const app = getApp();

const global = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: "",
    active1: "",
    show: 0,
    key: "",
    good_list: [],
    brandlist: [],
    circleList: [],
    tieList: [],
    page: 1
  },
  clear() {
    this.setData({
      key: ""
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      show: this.options.id,
      approot: global.approot
    });
  },
  onChange(e) {
    var key = this.data.key.replace(" ", "");
    var index = e.detail.index;
    var that = this;
    if (this.data.show == 1) {
      if (index == 0) {
        //商品
        wx.request({
          url: global.api + "&r=goods.get_list",
          data: {
            openid: openid,
            menu_id: that.options.menu_id,
            nationality: "",
            key: key,
            page: 1
          },
          success(res) {
            console.log(res.data.list);
            that.setData({
              good_list: res.data.list
            });
          }
        });
        return false;
        //品牌
      } else {
        wx.request({
          url: global.api + "&r=goods.brandsearching",
          data: {
            key: key,
            page: 1
          },
          success(res) {
            that.setData({
              brandlist: res.data.brandlist
            });
          }
        });
      }
      return false;
    }
    if (this.data.show == 2) {
      if (index == 0) {
        //圈子
        wx.request({
          url: getApp().globalData.api + "&r=sns.post.getboardlist",
          data: {
            keyword: key,
            page: 1
          },
          success(res) {
            console.log(res.data.list);

            var list = res.data.list;

            that.setData({
              circleList: list
            });
          }
        });
      } else {
        //帖子
        wx.request({
          url: getApp().globalData.api + "&r=sns.post.postListPlaza",
          data: {
            openid: openid,
            keyword: key,
            page: 1
          },
          success(res) {
            console.log(res.data.list);

            var list = res.data.list;

            that.setData({
              tieList: list
            });
          }
        });
      }
    }
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
  ToTie(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tieDetail/index?id=${id}`
    });
  },
  shuru(e) {
    this.setData({
      key: e.detail.value
    });
  },
  sousuo() {
    var that = this;
    var key = this.data.key.replace(" ", "");
    if (this.options.id == 1) {
      //商品
      wx.request({
        url: global.api + "&r=goods.get_list",
        data: {
          openid: openid,
          menu_id: that.options.menu_id,
          nationality: "",
          keyword: key
        },
        success(res) {
          console.log(res.data.list);
          that.setData({
            good_list: res.data.list
          });
        }
      });
      //品牌
      wx.request({
        url: global.api + "&r=goods.brandsearching",
        data: {
          key: key
        },
        success(res) {
          that.setData({
            brandlist: res.data.brandlist
          });
        }
      });
      return false;
    }
    //圈子
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.getboardlist",
      data: {
        keyword: key
      },
      success(res) {
        console.log(res.data.list);
    
          var list = res.data.list;

          that.setData({
            circleList: list
          });
        
      }
    });
    //帖子
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.postListPlaza",
      data: {
        openid: openid,
        keyword: key
      },
      success(res) {
        console.log(res.data.list);
  
          var list = res.data.list;

          that.setData({
            tieList: list
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

 
});
