const app = getApp();
var t = require("../../utils/wxParse/wxParse.js").wxParse;
const global = app.globalData;
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
        disabled:false,
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
        ImageNum:"",
        VideoNum:""
    },
    ToImgList(){
        var id = this.options.id
        wx.navigateTo({
            url:`/pages/shopping/shopDetailImg/index?id=${id}`
        })
    },
   
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: "../logs/logs"
        });
    },
    onLoad: function(options) {
        wx.checkSession({
            success() {  
            },
            fail() {
             wx.redirectTo({
                 url:`/pages/login/login/index?datatype=6&&id=${options.id}`
             })
            }
          });
        wx.getStorage({
            key: "userInfo",
            success(res) {}
        });
        console.log(options);
        this.setData({ show3: false, select: 0, number: 1 });
        var that = this;
        var values = wx.getStorageSync("sessionkey");
        wx.request({
            url: global.api + "&r=goods.get_detail",
            method: "GET",
            data: {
                id: options.id,
                openid: values.openid,
                breed_id:options.breed_id?options.breed_id:""
            },
            header: {
                "content-type": "application/json"
            },
            success(res) {
                that.setData({
                    VideoNum:res.data.VideoNum,
                    ImageNum:res.data.ImageNum,
                    list: res.data.goods,
                    disabled:res.data.goods.buy_status==1?false:true,
                    isfavorite: res.data.goods.isfavorite,
                    id: res.data.goods.id
                });
                t("article", "html", res.data.goods.content, that, 5);
            }
        });
   
    },
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
        if (this.data.list.buy_status == 1) {
            this.setData({ show3: true, select: 1 });
        } else {
            wx.showToast({
                title: "该商品无法加入购物车",
                icon: "none"
            });
        }
    },
    showPopup4() {
        if (this.data.list.buy_status == 1) {
            this.setData({ show3: true, select: 2 });
        } else {
            wx.showToast({
                title: "该商品无法购买",
                icon: "none"
            });
        }
    },
    //查看提问
    Hui(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url:`/pages/logs/quizDetail/index?id=${id}`
        })

    },

    ToDianpin(){
        var values = wx.getStorageSync("sessionkey");
        console.log(this.data.list)
        var title = this.data.list.title
        var image = this.data.list.thumb
        console.log(image)
        wx.request({
            url: getApp().globalData.api + "&r=pet.get_list",
            data: {
              openid: values.openid
            },
            success(res) {
              if(res.data.list.length==0){
                wx.showToast({
                    title:"请绑定宠物卡",
                    icon:"none"
                })
                return false
              }
            }
          });
        var id = this.options.id
        wx.navigateTo({
            url:`/pages/release/review/index?id=${id}&&title=${title}&&img=${image}`
        })
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
    onClose4() {
        // 购物车和购买公用一个接口
        var that = this;
        var values = wx.getStorageSync("sessionkey");
            console.log(this.data.select)
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
                    openid: values.openid,
                    url:route+"?id="+this.data.list.id
                },
                header: {
                    // form-data请求
                    "content-type": "application/x-www-form-urlencoded"
                },
                success(res) {
                    wx.showToast({
                        title:"添加成功，请去购物车页面查看"
                    })
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
    Tokefu(){
        wx.navigateTo({
            url:"/pages/my/kefu/index"
        })
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
        if(this.options.breed_id){
            var breed_id = this.options.breed_id
            wx.navigateTo({
                url: `/pages/shopping/shopDetailList/index?id=${id}&&breed_id=${breed_id}`
            });
            return false
        }
     
        wx.navigateTo({
            url: `/pages/shopping/shopDetailList/index?id=${id}`
        });
    }
});
