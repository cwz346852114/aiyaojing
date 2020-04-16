// pages/my/collection/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        load:true,
        page:1
    },
    onClose(event) {
        var that = this;
        var { list } = this.data;
        var { index } = event.currentTarget.dataset;
        var values = wx.getStorageSync("sessionkey");
        var id = event.currentTarget.dataset.id;

        wx.showModal({
            title: "提示",
            content: "是否确认删除",
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url:
                            getApp().globalData.api +
                            "&r=member.favorite.remove",
                        method: "POST",
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: {
                            ids: id,
                            openid: values.openid
                        },
                        success(res) {
                            list.splice(index, 1);

                            that.setData({
                                list: list
                            });
                            that.onLoad();
                        },
                        fali(res) {
                            console.log("删除失败");
                        }
                    });
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var values = wx.getStorageSync("sessionkey");
        wx.request({
            url: getApp().globalData.api + "&r=member.favorite.get_list",
            data: {
                openid: values.openid,
                page: 1
            },
            success(res) {
                console.log(res.data.list)
                that.setData({
                    list: res.data.list
                });
            }
        });
    },
    ToDetail(e){
      console.log(e)
      var goodsid = e.currentTarget.dataset.goodsid
      wx.navigateTo({
        url:`/pages/index/index?id=${goodsid}`
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
            url: getApp().globalData.api + "&r=member.favorite.get_list",
            data: {
              page:that.data.page+1,
            openid:values.openid,
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

    /**
     * 用户点击右上角分享
     */

});
