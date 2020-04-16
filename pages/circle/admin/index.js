const api = getApp().globalData.api;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    jinyan: [],
    lahei: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: api + "&r=sns.post.boardThingspeopleList",
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
    wx.request({
      url: api + "&r=sns.post.domestic_consumer&id=8&page=1&psize=10",
      data: {
        id: that.options.id,
        page: 1,
        psize: 10
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          jinyan: res.data.list
        });
      }
    });
    wx.request({
      url: api + "&r=sns.post.defriend_consumer&id=8&page=1&psize=10",
      data: {
        id: that.options.id,
        page: 1,
        psize: 10
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          lahei: res.data.list
        });
      }
    });
  },
  quxiao(e) {
    console;
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
          url: api + "&r=sns.post.domestic_consumer&id=8&page=1&psize=10",
          data: {
            id: that.options.id,
            page: 1,
            psize: 10
          },
          success(res) {
            if (res.data.list) {
              that.setData({
                jinyan: res.data.list
              });
              return false;
            }
            that.setData({
              jinyan: []
            });
          }
        });
      }
    });
  },
  gengduo() {
    var id = this.options.id
    wx.navigateTo({
      url:`/pages/circle/lahei/index?id=${id}&&lie=1`
    })
  },
  gengduo1() {
    var id = this.options.id
    wx.navigateTo({
      url:`/pages/circle/lahei/index?id=${id}&&lie=2`
    })
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
          url: api + "&r=sns.post.defriend_consumer&id=8&page=1&psize=10",
          data: {
            id: that.options.id,
            page: 1,
            psize: 10
          },
          success(res) {
            if (res.data.list) {
              that.setData({
                lahei: res.data.list
              });
              return false;
            }
            that.setData({
              lahei: []
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
  onShow: function() {
    var that = this;
    wx.request({
      url: api + "&r=sns.post.boardThingspeopleList",
      data: {
        id: that.options.id,
        page: 1,
        pagesize: 10
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          list: res.data.list
        });
      }
    });
    wx.request({
      url: api + "&r=sns.post.domestic_consumer&id=8&page=1&psize=10",
      data: {
        id: that.options.id,
        page: 1,
        pagesize: 10
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          jinyan: res.data.list
        });
      }
    });
    wx.request({
      url: api + "&r=sns.post.defriend_consumer&id=8&page=1&psize=10",
      data: {
        id: that.options.id,
        page: 1,
        psize: 10
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          lahei: res.data.list
        });
      }
    });
  },
  quxiao(e){
    var id = e.currentTarget.dataset.id
    var that =this
    wx.request({
      url: api + "&r=sns.post.delThingspeople&id=4",
      data: {
        id: id,
      },
      success(res) {
        wx.request({
          url: api + "&r=sns.post.boardThingspeopleList",
          data: {
            id: that.options.id,
            page: 1,
            pagesize: 10
          },
          success(res) {
            console.log(res.data.list);
            that.setData({
              list: res.data.list
            });
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
});
