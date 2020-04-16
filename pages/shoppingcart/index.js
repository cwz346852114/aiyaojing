const app = getApp();
const global = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    list: [],
    totalprice: 0,
    ischeckall: false,
    checked: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: global.api + "&comefrom=wxapp&r=member.cart.get_cartv2",
      method: "GET",
      data: {
        openid: values.openid
      },
      success(res) {
        if (res.data.list.length > 0) {
          that.setData({
            list: res.data.list,
            totalprice: res.data.totalprice * 100,
            total: res.data.total,
            ischeckall: res.data.ischeckall,
            show: true
          });
        } else {
          that.setData({
            show: false
          });
        }
      }
    });
  },
  //复选框选中
  onChange(e) {
    var that = this;

    var index = parseInt(e.currentTarget.dataset.index);

    var selected = this.data.list[index].selected;
    if (selected == 0) {
      selected = false;
    } else if (selected == 1) {
      selected = true;
    }
    var list = this.data.list;
    list[index].selected = !selected;

    this.setData({
      list: list
    });

    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: global.api + "&r=member.cart.select",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        id: e.currentTarget.dataset.id,
        select: this.data.list[index].selected == true ? 1 : 0,
        openid: values.openid
      },
      success(res) {
        that.onLoad();
      }
    });
  },
  //全选
  onChange1(event) {
    var that = this;

    that.setData({
      checked: event.detail
    });

    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: global.api + "&r=member.cart.select",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        id: "all",
        select: that.data.checked == true ? 1 : 0,
        openid: values.openid
      },
      success(res) {
        that.onLoad();
      }
    });
  },
  //商品数量
  onChange2(e) {
    var that = this;
    var total = e.detail;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: global.api + "&r=member.cart.update",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        id: e.currentTarget.dataset.id,
        total: total,
        openid: values.openid
      },
      success(res) {
        that.onLoad();
      }
    });
  },
  //删除
  onClose(event) {
    var that = this;
    var { list } = this.data;
    var { index } = event.currentTarget.dataset;
    var values = wx.getStorageSync("sessionkey");

    wx.showModal({
      title: "提示",
      content: "是否确认删除",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: global.api + "&r=member.cart.removeone",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              id: event.currentTarget.dataset.id,
              openid: values.openid
            },
            success(res) {
              list.splice(index, 1);

              that.setData({
                list: list
              });
              that.onLoad();
            },
            fali(res) {}
          });
        }
      }
    });
  },
  // 去逛逛
  onClose3() {
    wx.reLaunch({
      url: "/pages/home/index"
    });
  },
  onClickButton(e) {
    console.log(this.data.list);
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: global.api + "&r=order.create",
      method: "GET",
      data: {
        openid: values.openid
      },
      success() {
        wx.navigateTo({
          url: `/pages/order/list/index`
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
