const app = getApp();

const global = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    approot: global.approot,
    page: 1,
    load: true,
    show: false,
    meng: false,
    num: 0,
    list: [],
    list1: [],
    imgUrls: [],
    img: "/image/y-heart.png",
    img1: "/image/wheart.png",
    tabbar1: [
      { url: "/image/001.png", title: "主粮榜", menu_id: "1" },
      { url: "/image/zu14.png", title: "零食榜", menu_id: "2" },
      { url: "/image/zu15.png", title: "玩具榜", menu_id: "3" },
      { url: "/image/zu16.png", title: "护理榜", menu_id: "4" },
      { url: "/image/zu20.png", title: "保健榜", menu_id: "5" },
      { url: "/image/zu19.png", title: "用品榜", menu_id: "6" },
      { url: "/image/zu13.png", title: "装扮榜", menu_id: "7" },
      { url: "/image/zu12.png", title: "新人特惠", menu_id: "8" },
      { url: "/image/zu11.png", title: "每日上新", menu_id: "9" },
      { url: "/image/zu17.png", title: "偷罐头", menu_id: "10" }
    ],
    index: 0,
    openid: "",
    shows:false,
    statu:true,
    yinimg:[],
    number:0
  },
  onLoad: function() {
   
    var that = this
    this.setData({
      approot:global.approot
    })
    var values = wx.getStorageSync("sessionkey")
    if(values.openid){
      this.setData({
        openid:values.openid
      })
    }else{
      this.setData({
        openid:""
      })
    }
    var yindao =   wx.getStorageSync("yindao")
    if(yindao.yindao &&this.data.openid){
      console.log(this.data.statu)
     this.setData({
       statu:false
     })
    }
    wx.request({
      url: getApp().globalData.api + "&r=shop.index.get_adv_list",
      data: {
        location: 5
      },
      success(res) {
        console.log(res.data)
        that.setData({
          yinimg: res.data.data
        });
      }
      
    });
    if(this.data.statu &&this.data.openid){
      wx.setStorage({
        key:"yindao",
        data:{
          yindao:'yindao'
        }
      })
    };
   
  
 
  },
  onClose2(){

  },
  ToTieDetail(e) {
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: `/pages/circle/tieDetail/index?id=${id}`
    });
  },
  sousuo() {
    console.log(1);
    wx.navigateTo({
      url: "/pages/search/home/index"
    });
  },
  dianzan(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;

    var id = this.data.list1[index].id;
    var isfavorite = this.data.list1[index].deleted;

    var number = parseInt(this.data.list1[index].zan_count);

    const row = `list1[${index}].deleted`;
    const sum = `list1[${index}].zan_count`;
    isfavorite = !isfavorite;
    if (isfavorite) {
      isfavorite = 1;
    } else if (!isfavorite) {
      isfavorite = 0;
    }

    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.fabulousPost",
      data: {
        id: id,
        isfavorite: isfavorite,
        openid: values.openid
      },
      success(res) {
        that.setData({
          [row]: res.data.isfavorite
        });

        if (res.data.isfavorite) {
          number = number + 1;
          that.setData({
            [sum]: number
          });
        } else {
          number = number - 1;
          that.setData({
            [sum]: number
          });
        }
      }
    });
    
    
  },
  togoodList(e) {
    var id = e.currentTarget.dataset.menu_id;
    var title = e.currentTarget.dataset.title;
    if (id == 8) {
      wx.navigateTo({
        url: `/pages/xinren/index`
      });
      return false;
    }
    if (id == 9) {
      wx.navigateTo({
        url: `/pages/tehui/index?`
      });
      return false;
    }
    if (id == 10) {
      wx.navigateTo({
        url: `/pages/Socialcontact/MyGuan/index`
      });
      return false;
    }
    wx.navigateTo({
      url: `/pages/list/index?id=${id}&&title=${title}`
    });
  },
  onClose() {
    this.setData({ meng: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  login(){
    wx.navigateTo({
      url:'/pages/login/login/index'
    })
  },
  ToMiaosha() {
    wx.navigateTo({
      url: "/pages/miaosha/index"
    });
  },
  ToKanjia() {
    wx.navigateTo({
      url: "/pages/kanjia/list/index"
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  tianjia() {
    wx.navigateTo({
      url: "/pages/id/headPortrait/index"
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  noneEnoughPeople() {},
  tankuang(){
    this.setData({
      shows:true
    })
  },
  onClose1(){
    this.setData({
      shows:false
    })
  },
  onShow: function() {
    wx.showLoading({
      title: "加载中"
    });
    var shuaxin = wx.getStorageSync("shuaxin");
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
        if (res.data.list.length < 1) {
          that.setData({
            meng: true
          });
        }
      }
    });
    wx.request({
      url: global.api + "&r=shop.index.get_adv_list",
      data: {
        location: 1
      },
      success(res) {
        that.setData({
          imgUrls: res.data.data
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.attentionPosts",
      data: {
        openid: values.openid,
        type: "hot",
        page: 1
      },
      success(res) {
        wx.hideLoading();
        that.setData({
          list1: res.data.list,
          page: 1
        });
      }
    });
  },
  editIndex(e){
    if(this.data.number>=this.data.yinimg.length-1){
      this.setData({
          statu:false
      })
    }
    console.log(e.currentTarget.dataset.index)
    this.setData({
      number:this.data.number+1
    })
  },
  //添加宠物身份证
  add() {
    wx.navigateTo({
      url: "/pages/id/headPortrait/index"
    });
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
  onPullDownRefresh() {
    var shuaxin = wx.getStorageSync("shuaxin");
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
        if (res.data.list.length < 1) {
          that.setData({
            meng: true
          });
        }
      }
    });
    wx.request({
      url: global.api + "&r=shop.index.get_adv_list",
      data: {
        location: 1
      },
      success(res) {
        that.setData({
          imgUrls: res.data.data
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.attentionPosts",
      data: {
        openid: values.openid,
        type: "hot",
        page: 1
      },
      success(res) {
        wx.hideLoading();
        that.setData({
          list1: res.data.list,
          page: 1
        });
        wx.stopPullDownRefresh();
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
        url: getApp().globalData.api + "&r=sns.post.attentionPosts",
        data: {
          openid: values.openid,
          type: "hot",
          page: that.data.page + 1
        },
        success(res) {
          wx.hideLoading();
          console.log(res);

          if (res.data.list && res.data.list.length > 0) {
            var content = that.data.list1.concat(res.data.list);
            //将放回结果放入content
            that.setData({
              load: true,
              list1: content
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

  showPopup1() {
    wx.navigateTo({
      url: "/pages/select/index"
    });
  },
  onClose() {
    this.setData({
      meng: false
    });
  }
});
