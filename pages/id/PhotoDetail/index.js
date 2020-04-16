var util = require("../../../utils/time.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    approot: "",
    img: "/image/y-heart.png",
    img1: "/image/wheart.png",
    list1:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey")
    wx.checkSession({
      success() {},
      fail() {
        wx.redirectTo({
          url: `/pages/login/login/index?datatype=${8}&&id=${options.id}`
        });
      }
    });
    var that = this;
    this.setData({
      approot: getApp().globalData.approot
    });
    wx.request({
      url: getApp().globalData.api + "&r=goods.remarkon.goodsPhotoAlbumDetails",
      data: {
        id: options.id,
        openid:values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list
        });

        var list = res.data.list;

        list.create_time = util.formatDate1(list.create_time * 1000);

        that.setData({
          list: list
        });
      }
    });
    wx.request({
      url: global.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
        if (that.data.list.length > 0) {
          wx.request({
            url: global.api + "&r=pet.getPetFoodCan",
            data: {
              frompetid: that.data.list[0].id,
              openid: values.openid,
              topetid: that.data.list[0].id
            },
            success(res) {
              that.setData({
                petFoodCantotal:
                  res.data.petFoodCantotal == null
                    ? 0
                    : res.data.petFoodCantotal,
                zan_count: res.data.zan_count,
                feed: res.data.feed
              });
            }
          });

          wx.request({
            url: global.api + "&r=goods.remarkon.goodsRemarksList",
            data: {
              openid: values.openid,
              pet_id: that.data.list[0].id
            },
            success(res) {
              var list1 = res.data.list;


              that.setData({
                list1: list1
              });
            }
          });
     
        }
      }
    });
  },
  dianzan(e){
    console.log(e)
    var values = wx.getStorageSync("sessionkey")
    var that = this
    var isfavorite = this.data.list.isfavorite
    const row = `list.isfavorite`
    const sum = `list.zan_count`
    isfavorite = !isfavorite
  
    wx.request({
      url:getApp().globalData.api+"r=goods.remarkon.attentionPhotoAlbum",
      data:{
        id:that.options.id,
        frompetid:that.data.list1.id,
        isfavorite:isfavorite,
        openid:values.openid
      },
      success(res){
        console.log(res)
        // that.setData({
        //   [row]:res.data.isfavorite
        // })
      }
    })
  },
  fangda(e) {
    var list = this.data.list.images_list;
    var index = e.currentTarget.dataset.index;

    let imgArr = [];
    for (var i = 0; i < list.length; i++) {
   
        //找到图片所在的数组
        imgArr[i] = this.data.approot+list[i].image;
      
    }
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
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

  /**
   * 用户点击右上角分享
   */

});
