

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    list1: [],
    approot: "",
    petlist: [],
    page:1,
    load:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var values = wx.getStorageSync("sessionkey")
    this.setData({
      approot: getApp().globalData.approot
    });
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          list1: res.data.list
        });
        wx.request({
          url: getApp().globalData.api + "&r=pet.attentionPetCardList",
          data: {
            openid: values.openid,
            petid: that.data.list1[0].id,
            page: 1,
            psize: 10
          },
          success(res) {
            var list1 = res.data.list;
            that.setData({
              list: list1
            });
          }
        });
      }
    });
  },
  Quxiao(e) {
    var id = e.currentTarget.dataset.topetid;
    var that =this
    var values = wx.getStorageSync("sessionkey")
    wx.request({
      url: getApp().globalData.api + "&r=pet.attentionPetCard",
      data: {
        frompetid: that.data.list1[0].id,
        openid: values.openid,
        isfavorite: 0,
        topetid: id
      },
      success(res) {
        wx.request({
          url: getApp().globalData.api + "&r=pet.attentionPetCardList",
          data: {
            openid: values.openid,
            petid: that.data.list1[0].id,
            page: 1,
            psize: 10
          },
          success(res) {
            var list1 = res.data.list;
            that.setData({
              list: list1
            });
          }
        });
      }
    });
  },
  ToLieBiao(e){
    var openid = e.currentTarget.dataset.openid
    var topetid =  e.currentTarget.dataset.topetid
    wx.navigateTo({
      url:`/pages/Socialcontact/otherList/index?id=${topetid}&&openid=${openid}`
    })
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
        url: getApp().globalData.api + "&r=pet.attentionPetCardList",
        data: {
          openid: openid,
          petid: that.data.list1[0].id,
          page: that.data.page+1,
          psize: 10
        },
        success(res) {
          wx.hideLoading();
          console.log(res);

          if (res.data.list && res.data.list.length > 0) {
            var content = that.data.list.concat(res.data.list);
            //将放回结果放入content
            that.setData({
              load: true,
              list: content
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


});
