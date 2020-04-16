

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    show:false,
    cutPrice:"",
    page:1,
    load:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  kanjia(e){
    var values = wx.getStorageSync("sessionkey")
      var that = this
      var panduan = e.currentTarget.dataset.panduan
      var id = e.currentTarget.dataset.id
    if(panduan){
      wx.navigateTo({
        url:`/pages/kanjia/listDetail/index?id=${id}`
      })
      return false
    }
    wx.request({
      url:getApp().globalData.api+"&r=bargain.bargain",
      data:{
        openid:values.openid,
        id:id,
        ajax:151,
      },
      success(res){
        if(res.data.error==0){
          that.setData({
            show:true,
            cutPrice:res.data.cutPrice,
            actor_id:res.data.actor_id,

          })
          wx.request({
            url:getApp().globalData.api+"&r=bargain.get_list",
            data:{
              openid:values.openid
            },
            success(res){
              console.log(res.data.list)
              that.setData({
                list:res.data.list
              })
      
            }
          })
        }else{
          wx.showToast({
            title:res.data.error,
            icon:'none'
          })
        }
       
      }
    })
  },
  //砍价
  onShareAppMessage: function(res) {
    var values = wx.getStorageSync("sessionkey")
    var i = this;
    if (res.from == "button") {
      return {
        title: "帮砍价",
        path:
          "/pages/kanjia/listDetail/index?id=" +
          "69" +
          "&actor_id=" +
          i.data.actor_id +
          "&openid=" +
          values.openid,
        success: function(a) {},
        fail: function(a) {}
      };
    }
  
  },
  onClose() {
    this.setData({ show: false });
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
    var that = this
    var values = wx.getStorageSync("sessionkey")
    wx.request({
      url:getApp().globalData.api+"&r=bargain.get_list",
      data:{
        openid:values.openid,
        page:1
      },
      success(res){
        that.setData({
          list:res.data.list
        })

      }
    })
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

    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      this.setData({
        load: false
      });
      var that = this
      var values = wx.getStorageSync("sessionkey")
     
      wx.request({
        url:getApp().globalData.api+"&r=bargain.get_list",
        method: "get",
        data: {
          openid:values.openid,
          page:that.data.page+1
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

  /**
   * 用户点击右上角分享
   */

})