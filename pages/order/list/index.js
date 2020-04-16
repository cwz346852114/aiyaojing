const app = getApp();
const global = app.globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    columns: [50, 100, 150, 200, 300],
    goodsprice: 0, //商品总金额
    realprice: 0, //实收金额
    dispatch_price: 0, //运费
    list: [],
    address: {},
    good: {},
    head: 1,
    load: true,
    type: 0,
    checked: false,
    integral: "",
    good_feednum: "",
    shenfenid: "",
    name: "",
    remark: "",
    cross_border: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.url)

    if (options.type) {
      this.setData({
        type: options.type
      });
    }
    if (options.heads) {
      this.setData({
        head: options.heads
      });
    }

    var values = wx.getStorageSync("sessionkey");
    var that = this;
    console.log(options)
    if (options.total) {
      wx.setStorage({
        key: "options",
        data: {
          id: options.id,
          total: options.total
        }
      });
    }
    //砍价
    if (options.type == 1) {
      wx.request({
        url: global.api + "&r=order.create",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          bargainid: options.id,
          openid: values.openid,
          total: 1
        },
        success(res) {
          console.log(res.data);
          that.setData({
            list: res.data.goods[0].goods,
            goodsprice: res.data.goodsprice,
            realprice: res.data.realprice,
            dispatch_price: res.data.dispatch_price,
            address: res.data.address,
            good: res.data.goods[0]
          });
        }
      });
      return false;
    }
    //秒杀
    if (options.type == 2) {
      wx.request({
        url: global.api + "&r=order.create",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          common_id: options.id,
          openid: values.openid,
          common_type: options.type
        },
        success(res) {
          if (res.data.error == 1) {
            wx.showModal({
              title: res.data.message + ",点击跳回上一页",
              icon: "none",
              success() {
                wx.navigateBack({
                  delta: 1
                });
              },
              fail() {
                wx.navigateBack({
                  delta: 1
                });
              }
            });
            return false;
          }

          that.setData({
            list: res.data.goods[0].goods,
            goodsprice: res.data.goodsprice,
            realprice: res.data.realprice,
            dispatch_price: res.data.dispatch_price,
            address: res.data.address,
            good: res.data.goods[0]
          });
        }
      });
      return false;
    }
    //拼团
    if (options.type == 3) {
      wx.request({
        url: global.api + "&r=order.create",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          common_id: options.id,
          openid: values.openid,
          common_type: options.type
        },
        success(res) {
          console.log(res.data);
          that.setData({
            list: res.data.goods[0].goods,
            goodsprice: res.data.goodsprice,
            realprice: res.data.realprice,
            dispatch_price: res.data.dispatch_price,
            address: res.data.address,
            good: res.data.goods[0]
          });
        }
      });
      return false;
    }
      wx.request({
        url: global.api + "&r=order.create",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          id: options.id ? options.id : "",
          total: options.total ? options.total : "",
          openid: values.openid
        },
        success(res) {
          console.log(res.data)
          that.setData({
            list: res.data.goods[0].goods,
            goodsprice: res.data.goodsprice,
            realprice: res.data.realprice,
            dispatch_price: res.data.dispatch_price,
            address: res.data.address,
            good: res.data.goods[0],
            integral: res.data.integral,
            good_feednum: res.data.good_feednum,
            cross_border: res.data.cross_border,
            name:res.data.member.kj_realname?res.data.member.kj_realname:"",
            shenfenid:res.data.member.kj_idcard?res.data.member.kj_idcard:""
          });
        }
      });
    
  },
  //选择是否罐头抵用
  onChange(event) {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    this.setData({
      checked: event.detail
    });
    wx.request({
      url: global.api + "&r=order.create",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        id: that.options.id ? that.options.id : "",
        total: that.options.total ? that.options.total : "",
        openid: values.openid,
        pitch_on: event.detail
      },
      success(res) {
        that.setData({
          list: res.data.goods[0].goods,
          goodsprice: res.data.goodsprice,
          realprice: res.data.realprice,
          dispatch_price: res.data.dispatch_price,
          address: res.data.address,
          good: res.data.goods[0],
          integral: res.data.integral
        });
      }
    });
  },
  //去收货列表
  Todizhi() {
    wx.navigateTo({
      url: "/pages/my/list/index?id=0"
    });
  },
  onChange1(e) {
    this.setData({
      name: e.detail
    });
  },
  onChange2(e) {
    this.setData({
      shenfenid: e.detail
    });
  },
  bindinput(e) {
    console.log(e);
    this.setData({
      remark: e.detail.value
    });
  },
  // 创建订单
  onSubmit() {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    if (this.data.address == "") {
      wx.showToast({
        title: "请选择收货地址",
        icon: "none"
      });
      return false;
    }

    //拼团
    if (this.options.type == 3) {
      wx.request({
        url: global.api + "&r=groups.order.create_order",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          openid: values.openid,
          id: that.options.id,
          aid: that.data.address.id,
          type: "groups",
          heads: that.data.head,
          teamid: that.options.teamid ? that.options.teamid : ""
        },
        success(res) {
          if (res.data.error == 1) {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            });
            return false;
          }
          wx.request({
            url: global.api + "&r=groups.pay",
            data: {
              openid: values.openid,
              orderid: res.data.orderid,
              teamid: res.data.teamid
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
                    title: "支付失败",
                    icon: "none"
                  });

                  setTimeout(() => {
                    wx.navigateTo({
                      url: `/pages/my/SpellGroup/index`
                    });
                  }, 1000);
                }
              });
            }
          });
        }
      });
      return false;
    }
    if (this.data.list.length > 1) {
      var id = 0;
    } else {
      var id = this.data.list[0].id;
    }
     var goods = that.data.good.goods
     console.log(goods)
    if(this.options.url){
      for(var i=0;i<goods.length;i++){
        goods[i]['url']= this.options.url+"?id="+id
      }
    }
    console.log(goods)
    //转换成json字符串丢给后端
    var good = JSON.stringify(goods);
    if (this.data.name == "" && this.data.cross_border) {
      wx.showToast({
        title: "请填写真姓名",
        icon: "none"
      });
      return false;
    }
    if (this.data.cross_border) {
      if (
        !/(^\d{15}$)||(^\d{18}$)||(^\d{17}(\d|X|x)$)/.test(this.data.shenfenid)
      ) {
        wx.showToast({
          title: "身份证号码有误",

          duration: 2000,

          icon: "none"
        });

        return false;
      }
    }
    if (this.data.load) {
      this.setData({
        load: false
      });
    } else {
      return false;
    }
    var data = {
      id: id,
      openid: values.openid,
      addressid: that.data.address.id,
      goods: good,
      common_id: this.options.id ? this.options.id : "",
      common_type: that.options.type ? that.options.type : "",
      kj_realname: that.data.cross_border ? that.data.name : "",
      kj_idcard: that.data.cross_border ? that.data.shenfenid : "",
      remark: that.data.remark ? that.data.remark : "",
      pitch_on: that.data.checked,
      
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
            var id = res.data.order.id;
            let wechatPay = res.data.wechat.payinfo;
            wx.requestPayment({
              timeStamp: wechatPay.timeStamp,
              nonceStr: wechatPay.nonceStr,
              package: wechatPay.package,
              signType: "MD5",
              paySign: wechatPay.paySign,
              success(res) {
                wx.navigateTo({
                  url: `/pages/order/results/index?id=${id}`
                });
              },
              fail(res) {
                wx.showToast({
                  title: "取消支付",
                  icon: "none"
                });
                that.setData({
                  load: true
                });
                setTimeout(() => {
                  wx.navigateTo({
                    url: `/pages/order/orderDetail/index?id=${id}`
                  });
                }, 1000);
              }
            });
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
  isCardNo(num) {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
      return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15) {
      re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      var arrSplit = num.match(re);

      //检查生日日期是否正确
      var dtmBirth = new Date(
        "19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
      );
      var bCorrectDay;
      bCorrectDay =
        dtmBirth.getYear() == Number(arrSplit[2]) &&
        dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
        dtmBirth.getDate() == Number(arrSplit[4]);
      if (!bCorrectDay) {
        return false;
      } else {
        //将15位身份证转成18位
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var arrInt = new Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        );
        var arrCh = new Array(
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2"
        );
        var nTemp = 0,
          i;
        num = num.substr(0, 6) + "19" + num.substr(6, num.length - 6);
        for (i = 0; i < 17; i++) {
          nTemp += num.substr(i, 1) * arrInt[i];
        }
        num += arrCh[nTemp % 11];
        return true;
      }
    }
    if (len == 18) {
      re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      var arrSplit = num.match(re);

      //检查生日日期是否正确
      var dtmBirth = new Date(
        arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
      );
      var bCorrectDay;
      bCorrectDay =
        dtmBirth.getFullYear() == Number(arrSplit[2]) &&
        dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
        dtmBirth.getDate() == Number(arrSplit[4]);
      if (!bCorrectDay) {
        return false;
      } else {
        //检验18位身份证的校验码是否正确。
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var valnum;
        var arrInt = new Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        );
        var arrCh = new Array(
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2"
        );
        var nTemp = 0,
          i;
        for (i = 0; i < 17; i++) {
          nTemp += num.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != num.substr(17, 1)) {
          return false;
        }

        return true;
      }
    }
    wx.showToast({
      title: "身份证信息填写错误",
      icon: "none"
    });

    return false;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {},

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
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },

  onConfirm(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  onCancel() {
    this.setData({
      show: false
    });
  },
  //地址页面事件刷新
  changeData: function() {
    var that = this;
    var options = wx.getStorageSync("options");
    console.log(options);
    var values = wx.getStorageSync("sessionkey");
    if (values.openid) {
      wx.request({
        url: global.api + "&r=member.address.get_detail",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          id: options.id,
          openid: values.openid
        },
        success(res) {
          console.log(res.data.detail);
          that.setData({
            address: res.data.detail
          });
        }
      });
    }
  }
});
