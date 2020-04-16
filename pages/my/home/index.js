// pages/my/home/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: [
      { img: "/image/my/daifukuan.png", title: "待付款", id: 1 },
      { img: "/image/my/daifahuo.png", title: "待发货", id: 2 },
      { img: "/image/my/yifahuo.png", title: "已发货", id: 3 },
      { img: "/image/my/qianshou.png", title: "签收", id: 4 }
    ],
    list: [],
    shows:false
  },
  ToShop(){
    wx.navigateTo({
      url:'/pages/shoppingcart/index'
    })
  },
  Toshoucang() {
    wx.navigateTo({
      url: "/pages/my/collection/index"
    });
  },
  Tochongwu() {
    wx.switchTab({
      url: "/pages/id/list/index"
    });
  },
  ToGuan() {
    wx.navigateTo({
      url: "/pages/my/focus/index"
    });
  },
  Todetail(e) {
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: `/pages/order/orderList/index?id=${id}`
    });
  },
  Tokefu() {
    wx.navigateTo({
      url: `/pages/my/kefu/index`
    });
  },
  Tokefu1(){
    wx.navigateTo({
      url: `/pages/my/gongzhonghao/index`
    });
  },
  ToMyMessage() {
    wx.navigateTo({
      url: `/pages/my/message/index`
    });
  },
  Topintuan() {
    wx.navigateTo({
      url: `/pages/my/SpellGroup/index`
    });
  },
  Tokanjia() {
    wx.navigateTo({
      url: `/pages/my/bargaining/index`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey");
    if(values.openid){
      this.setData({
        openid:values.openid
      })
    }else{
      this.setData({
        openid:""
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.mydetail();
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

  // 收货地址
  shouhuodizhi() {
    wx.navigateTo({
      url: "/pages/my/list/index"
    });
  },
  //全部订单
  allOrder() {
    wx.navigateTo({
      url: "/pages/order/orderList/index"
    });
  },
  //查询我的详情
  mydetail() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=member",
      data: {
        openid: values.openid
      },
      success(res) {
        console.log(res);
        that.setData({
          list: res.data
        });
      }
    });
  },
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
});
