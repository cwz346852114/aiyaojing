// pages/xinren/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    load:true,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url:getApp().globalData.api+"&r=newpreferential.get_list",
      data:{
        page:1
      },
      success(res){
        that.setData({
          list:res.data.list.list
        })
      }
    })
  },
  ToXiangqing(e){
    var id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url:`/pages/fenxiao/Detail/index?id=${id}&&type=1`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
      wx.request({
        url:getApp().globalData.api+"&r=newpreferential.get_list",
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
    }
  },


})