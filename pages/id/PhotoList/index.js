const app = getApp();
const global = app.globalData;
var util = require("../../../utils/time.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list2:[],
    list:[],
    approot:"",
    load:true,
    page:1,
    img: "/image/y-heart.png",
    img1: "/image/wheart.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    this.setData({
      approot: getApp().globalData.approot
    });
    wx.request({
      url: global.api + "&r=pet.get_list",
      data: {
        openid: that.options.openid
      },
      success(res) {
    
        that.setData({
          list: res.data.list
        });
        wx.request({
          url: global.api + "&r=goods.remarkon.GoodsPhotoAlbumList",
          data: {
            openid: that.options.openid,
            pet_id: res.data.list[0].id
          },
          success(res) {
        
            var list2 = res.data.list;
            for (let i = 0; i < list2.length; i++) {
              list2[i]["create_time"] = util.formatDate1(
                list2[i]["create_time"] * 1000
              );
            }
            that.setData({
              list2: list2
            });
            console.log(that.data.list2)
          }
        });
      }
    });
  },
  fangda(e) {
    var list = this.data.list2;
    var bindex = e.currentTarget.dataset.bindex;
    var index = e.currentTarget.dataset.index;
    let imgArr = [];

    for (var i = 0; i < list[bindex].images.length; i++) {
      imgArr[i] = this.data.approot + list[bindex].images[i].image;
    }
    console.log(imgArr);
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
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
        url: global.api + "&r=goods.remarkon.GoodsPhotoAlbumList",
        data: {
          openid: that.options.openid,
          pet_id: that.data.list[0].id,
          page:that.data.page+1
        },
        success(res) {
          wx.hideLoading();
          var list2 = res.data.list;
          if(res.data.list&&res.data.list.length>0){
            for (let i = 0; i < list2.length; i++) {
              list2[i]["create_time"] = util.formatDate1(
                list2[i]["create_time"] * 1000
              );
            }
            var content = that.data.list1.concat(list2);
            that.setData({
              list2: content,
            });
            that.data.page++
          }else{
            wx.showToast({
              title:"已经到底了",
              icon:"none",
              duration: 2000
            })
          }
          that.setData({
            load:true
          })
        }
      });
    }
  },


})