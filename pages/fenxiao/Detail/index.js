const app = getApp();
var t = require("../../../utils/wxParse/wxParse.js").wxParse;
const global = app.globalData;
const openid = wx.getStorageSync("sessionkey").openid;
Page({
  data: {
    motto: "Hello World",
    isfavorite: "", //收藏
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    value: 3,
    select: 0,
    number: 1, //商品数量
    show1: false,
    show2: false,
    show3: false,
    imgs1: [
      { url: "/image/1x.png" },
      { url: "/image/1x.png" },
      { url: "/image/1x.png" },
      { url: "/image/1x.png" },
      { url: "/image/1x.png" }
    ],
    imgs2: [
      { url: "/image/1x.png" },
      { url: "/image/1x.png" },
      { url: "/image/1x.png" },
      { url: "/image/1x.png" }
    ],
    imgs3: [
      { url: "/image/1x.png" },
      { url: "/image/1x.png" },
      { url: "/image/1x.png" }
    ],
    imgs4: [{ url: "/image/1x.png" }, { url: "/image/1x.png" }],
    list: {},
    list1: [],
    id: "",
    options: "",
    seckillinfo: "",
    time: 0,
    ImageNum:"",
        VideoNum:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  Torelease() {
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: openid
      },

      success(res) {
        if (res.data.list.length == 0) {
          wx.showToast({
            title: "请绑定宠物卡",
            icon: "none"
          });
          return false;
        }
      }
    });
    var id = this.options.id;
    var title = this.data.list.title;
    wx.navigateTo({
      url: `/pages/release/review/index?id=${id}&&title=${title}`
    });
  },
  Tokefu(){
    wx.navigateTo({
        url:"/pages/my/kefu/index"
    })
},
  onLoad: function(options) {
    console.log(options)
    this.setData({ show3: false, select: 0, number: 1, options: options.type });
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    //新人特惠
    console.log(options);
    if (options.type == 1) {
      var newpeople = "&r=newpreferential.get_detail";
    }

    //拼团商品
    if(options.type == 3){
      var newpeople = "&r=groups.goods";
    }

    wx.checkSession({
      success() {},
      fail() {
        wx.redirectTo({
          url: `/pages/login/login/index?datatype=${options.type}&&id=${options.id}`
        });
      }
    });
    console.log(newpeople);
    wx.request({
      url: global.api + newpeople,
      method: "GET",
      data: {
        id: options.id,
        openid: values.openid
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log(res.data)
        that.setData({
          VideoNum:res.data.VideoNum,
          ImageNum:res.data.ImageNum,
          list: res.data.goods,
          isfavorite: res.data.goods.isfavorite,
          id: res.data.goods.id,
          seckillinfo: res.data.goods.seckillinfo
            ? res.data.goods.seckillinfo
            : "",
          time:
            (res.data.goods.seckillinfo.endtime - res.data.goods.now_time) *
            1000
        });
        t("article", "html", res.data.goods.content, that, 5);
      }
    });

    wx.request({
      url: global.api + "&r=goods.get_picker",
      method: "GET",
      data: {
        id: options.id
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        that.setData({
          list1: res.data.goods
        });
      }
    });
  },
  onReady: function() {},
  onReady: function() {},
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  showPopup1() {
    this.setData({ show1: true });
  },
  showPopup2() {
    this.setData({ show2: true });
  },
  showPopup3() {
    var that = this
   
    wx.request({
      url: global.api + "&r=newpreferential.xinren",
      data: {
        openid: openid
      },
      success(res) {
        that.setData({ show3: true, select: 1 });
      }
    });
  },
  showPopup4() {
    var that = this
    that.setData({ show3: true, select: 2 });
  },
  //查看提问
  Hui(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/logs/quizDetail/index?id=${id}`
    });
  },
  ToDianpin() {
    var values = wx.getStorageSync("sessionkey");
    console.log(this.data.list);
    var title = this.data.list.title;
    var image = this.data.list.thumb;
    console.log(image);
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        if (res.data.list.length == 0) {
          wx.showToast({
            title: "请绑定宠物卡",
            icon: "none"
          });
          return false;
        }
      }
    });
    var id = this.options.id;
    wx.navigateTo({
      url: `/pages/release/review/index?id=${id}&&title=${title}&&img=${image}`
    });
  },
  onClose1() {
    this.setData({ show1: false });
  },
  onClose2() {
    this.setData({ show2: false });
  },
  onClose3() {
    this.setData({ show3: false, select: 0 });
  },
  onClose5(){
    wx.navigateTo({
      url: `/pages/order/list/index?id=${this.data.list.id}&&total=1`
    });
  },
  onClose4() {
    // 购物车和购买公用一个接口
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    var route = this.route
    if (this.data.select == 2) {
      wx.navigateTo({
        url: `/pages/order/list/index?id=${that.data.list.id}&&total=${that.data.number}&&url=${route}`
      });
    } else {
      wx.request({
        url: global.api + "&r=member.cart.add2",
        method: "POST",
        data: {
          id: this.data.list.id,
          total: this.data.number,
          openid: values.openid
        },
        header: {
          // form-data请求
          "content-type": "application/x-www-form-urlencoded"
        },
        success(res) {
          wx.navigateTo({
            url: `/pages/shoppingcart/index`
          });
        }
      });
    }

    this.setData({ show3: false, select: 0 });
  },
  tiaozhuan() {
    var id = this.data.id;
    wx.navigateTo({
      url: `/pages/logs/index?id=${id}`
    });
  },
  onChange(event) {
    this.setData({
      number: event.detail
    });
  },
  // 去购物车
  TOgouwuche() {
    wx.navigateTo({
      url: "/pages/shoppingcart/index"
    });
  },
  shoucang() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    if (this.data.isfavorite == false) {
      this.data.isfavorite = 1;
    } else {
      this.data.isfavorite = 0;
    }
    wx.request({
      url: getApp().globalData.api + "&r=member.favorite.toggle",
      data: {
        id: that.options.id,
        isfavorite: that.data.isfavorite,
        openid: values.openid
      },
      success(res) {
        that.setData({
          isfavorite: res.data.isfavorite
        });
      }
    });
  },
  //去商品详情
  toGoodDetail() {
    var id = this.data.id;
    wx.navigateTo({
      url: `/pages/shopping/shopDetailList/index?id=${id}`
    });
  }
});
