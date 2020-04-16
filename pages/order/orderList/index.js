const app = getApp();

const global = app.globalData;
var util = require("../../../utils/time.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    active:"",
    load:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    if(options.id){
      this.setData({
        active:parseInt(options.id)+1
      })
    }
    console.log(this.data.active)
    wx.request({
      url: global.api + "&r=order.get_list",
      method: "GET",
      data: {
        page: 1,
        status: that.data.active!=""?parseInt(that.data.active)-1:"",
        openid: values.openid
      },
      success(res) {
        var list = res.data.list;
        for (let i = 0; i < list.length; i++) {
          list[i]["createtime"] = util.formatDate1(list[i]["createtime"]*1000);
        }
        that.setData({
          list: list,
   
        });
      
      }
    });
  },
  onChange(e) {

    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: global.api + "&r=order.get_list",
      method: "GET",
      data: {
        page: 1,
        status: e.detail.index-1<0?"":e.detail.index-1,
        openid: values.openid
      },
      success(res) {
        var list = res.data.list;
     
        for (let i = 0; i < list.length; i++) {
          list[i]["createtime"] = util.formatDate1(list[i]["createtime"]*1000);
        }
        that.setData({
          list: list
        });
      }
    });
  },
  //去订单详情页
  ToDetail(e){
    var values = wx.getStorageSync('sessionkey')
    const id = e.currentTarget.dataset.id
  
    wx.navigateTo({
      url:`/pages/order/orderDetail/index?id=${id}&&openid=${values.openid}`
    })
  },
  pay(e){
    if (this.data.load) {
      this.setData({
        load: false
      });
    } else {
      return false;
    }
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    var index = e.currentTarget.dataset.index
    
 
    
    // 转换成json字符串丢给后端


    var good = JSON.stringify(that.data.list[index].goods[0].goods);

    var data = {
      id: that.data.list[index].ordersn,//订单id
      openid: values.openid,
      addressid:that.data.list[index].addressid,//地址id
      goods: good//订单内容
    };

    wx.request({
      url: global.api + "&r=order.create.submit",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data,
      success(res) {
        wx.request({
          url: global.api + "&r=order.pay",
          method: "GET",

          data: {
            id: res.data.orderid,
            openid: values.openid
          },
          success(res) {
           
            let wechatPay = res.data.wechat.payinfo
            wx.requestPayment({
              timeStamp: wechatPay.timeStamp,
              nonceStr:wechatPay.nonceStr,
              package: wechatPay.package,
              signType: 'MD5',
              paySign: wechatPay.paySign,
              success (res) { 
                wx.navigateTo({
                  url:"/pages/order/results/index"
                })
              },
              fail (res) {
                that.setData({
                  load:true
                })
                wx.showToast({
                  title:"取消支付"
                })
               }
            })
            // wx.request({
            //   url: global.api + "&r=order.order/pay/complete",
            //   method: "POST",
            //   header: {
            //     "content-type": "application/x-www-form-urlencoded"
            //   },
            //   data: {
            //     id: res.data.order.id,
            //     type: "wechat"
            //   },
            //   success(res) {
            //     console.log(res)
            //   }
            // });
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
