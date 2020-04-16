const app = getApp()
const global = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    address:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    console.log(options)
    var values = wx.getStorageSync("sessionkey")
    //砍价
    if(options.type==1){
      wx.request({
        url:global.api+"&r=bargain.get_detail",
        data:{
          id:options.id,
          openid:values.openid
        },
        success(res){
          console.log(res.data)
        }

      })
      return false
    }
    //拼团
    if(options.type==3){
      wx.request({
        url:global.api+"&r=groups.order.details",
        data:{
          orderid:options.id,
          openid:values.openid
        },
        success(res){
          console.log(res.data)
          that.setData({
            address:res.data.address,
            
          })
        }
      })
      return false
    }
    wx.request({
      url:global.api+"&r=order.detail",
      data:{
        id:options.id,
        openid:values.openid
      },
      success(res){
     
        that.setData({
          address:res.data.address,
          list:res.data
        })
      }
    })
  },
  pay(e){
    var values = wx.getStorageSync("sessionkey");
    var that = this;

    // 转换成json字符串丢给后端


    var good = JSON.stringify(that.data.list.goods);

    var data = {
      id: that.data.list.order.id,//订单id
      openid: values.openid,
      addressid:that.data.list.address.id,//地址id
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

  },


})