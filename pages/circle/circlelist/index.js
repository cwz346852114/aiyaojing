// pages/circle/circlelist/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    show: 0,
    isfavorite: false,
    approot: "",
    load: true,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    this.setData({
      approot: getApp().globalData.approot
    });

      wx.request({
        url: getApp().globalData.api + "&r=sns.post.getlist",
        data: {
          type: options.id,
          openid: values.openid
        },
        success(res) {
          console.log(res.data);
          that.setData({
            list: res.data.mylist,
            show: options.id
          });
        }
      });
  
    
   
  },
  ToGuan(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tiebalist/index?id=${id}`
    });
  },
  List(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/circle/tiebalist/index?id=${id}`
    });
  },
  Quxiao(e) {
    var id = e.currentTarget.dataset.id;
    var values = wx.getStorageSync("sessionkey");
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.attentionBoard",
      data: {
        id: id,
        isfavorite: 0,
        openid: values.openid
      },
      success(res) {
      that.data.list.splice(index,1)
 
        that.setData({
          list:that.data.list
        })
      }
    });
  },
  guanzhu(e) {
    var id = e.currentTarget.dataset.id;
    var values = wx.getStorageSync("sessionkey");
    var index = e.currentTarget.dataset.index;
    var that = this;

    this.data.list[index].is_deleted = !this.data.list[index].is_deleted;
    let deleted = `list[${index}].is_deleted`
    let total = `list[${index}].total`
    let number =  parseInt(this.data.list[index].total);

    wx.request({
      url: getApp().globalData.api + "&r=sns.post.attentionBoard",
      data: {
        id: id,
        isfavorite: this.data.list[index].is_deleted ? 1 : 0,
        openid: values.openid
      },
      success(res) {
        that.setData({
          [deleted]:res.data.isfavorite,
          
        })
        if (res.data.isfavorite) {
          number = number + 1;
          that.setData({
            [total]: number
          });
        } else {
          number = number - 1;
          that.setData({
            [total]: number
          });
        }
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
  onReachBottom: function() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.showLoading({
      title: "加载中"
    });
    console.log(this.data.load)
    if (this.data.load) {
      that.setData({
        load: false
      });
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.getlist",
        data: {
          type: this.options.id,
          openid: values.openid,
          page: that.data.page+1
        },
        success(res) {
          wx.hideLoading();
          console.log(res.data.mylist)
          if (res.data.mylist && res.data.mylist.length > 0) {
            var content = that.data.list.concat(res.data.mylist);
            that.setData({
              list: content,
              show: that.options.id
            });
            that.data.page++;
          } else {
            wx.showToast({
              title: "已经到底了",
              duration: 2000
            });
           
          }
          that.setData({
            load: true
          });
        }
      });
    }
  },


});
