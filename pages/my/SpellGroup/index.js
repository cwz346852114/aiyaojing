// pages/my/SpellGroup/index.js
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
    var values = wx.getStorageSync("sessionkey")
    var that = this
    wx.request({
      url:getApp().globalData.api+"&r=groups.order",
      data:{
        page:1,
        openid:values.openid,
        status:""
      },
      success(res){
        console.log(res.data)
        that.setData({
          list:res.data.list
        })
      }
    })
  },
  ToPay(e){
    if (this.data.load) {
      this.setData({
        load: false
      });
    } else {
      return false;
    }
    var that = this
    var values = wx.getStorageSync("sessionkey")
    var teamid = e.currentTarget.dataset.teamid;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url:getApp().globalData.api+ "&r=groups.pay",
      data: {
        openid: values.openid,
        orderid: id,
        teamid:teamid
      },
      success(res) {

        var teamid = res.data.data.teamid;
        let wechatPay = res.data.data.wechat.payinfo;
        wx.requestPayment({
          timeStamp: wechatPay.timeStamp,
          nonceStr: wechatPay.nonceStr,
          package: wechatPay.package,
          signType: "MD5",
          paySign: wechatPay.paySign,
          success(res) {
            wx.navigateTo({
              url: `/pages/pintuan/Detail/index?teamid=${teamid}`
            });
          },
          fail(res) {
            wx.showToast({
              title:"支付失败",
              icon:"none"
            })
    
            that.setData({
              load:true
            })
           
          }
        });
      }
    });
  },
  ToDetail(e){
    console.log(e)
    var teamid = e.currentTarget.dataset.teamid;
    wx.navigateTo({
      url:`/pages/pintuan/Detail/index?teamid=${teamid}`
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
    var values = wx.getStorageSync("sessionkey");
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
      wx.request({
        url: getApp().globalData.api + "&r=groups.order",
        data: {
          page: that.data.page+1,
          openid: values.openid,
          status:""
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