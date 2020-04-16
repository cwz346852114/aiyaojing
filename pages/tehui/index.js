// pages/tehui/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    approot: getApp().globalData.approot,
    list: [],
    page:1,
    list1:[],
    page:1,
    load:true,
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad: function(options) {
    console.log(options)
    wx.checkSession({
      success() {},
      fail() {
        wx.redirectTo({
          url: `/pages/login/login/index?datatype=2&&id=${options.id}`
        });
      }
    });
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=shop.index.get_adv_list",
      method: "get",
      data: {
        location: 3
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        that.setData({
          imgUrls: res.data.data
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=eachdayspecial.get_list",
      method: "get",
      data: {
        pagesize:5,
        page:1
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        that.setData({
          list: res.data.list
        });
        
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=groups.list",
      method: "get",
      data: {
        page:1,
      },
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        console.log(res.data.list)
        that.setData({
          list1: res.data.list
        });
        
      }
    });
  },
  onClick(e){
 
      this.setData({
        index:e.detail.index,
        page:1
      })
  },
  chaozhi(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:`/pages/fenxiao/Detail/index?id=${id}&&type=2`
    })
  },
  //去商品详情
  // pintuan(e){
  //   var id = e.currentTarget.dataset.id
  //   wx.navigateTo({
  //     url:`/pages/fenxiao/Detail/index?id=${id}&&type=3`
  //   })
  // },
  //支付
   pintuan(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:`/pages/order/list/index?id=${id}&&total=1&&type=3`
    })
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
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
      console.log(this.data.index==0)
    if(this.data.index==0){
        wx.request({
          url:getApp().globalData.api + "&r=eachdayspecial.get_list",
          method: "get",
          data: {
            page: this.data.page + 1,
            pagesize:5
          },
          header: {
            "content-type": "application/json"
          },
          success(res) {
            wx.hideLoading();
            console.log(res.data.list)
            if (res.data.list && res.data.list.length > 0) {
              var content = that.data.list.concat(res.data.list);
              //将放回结果放入content
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
        return false
      }
  
      wx.request({
        url:  getApp().globalData.api + "&r=groups.list",
        method: "get",
        data: {
          page: this.data.page + 1,
          
        },
        header: {
          "content-type": "application/json"
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
    }
  },

  onShareAppMessage(){

  },
});
