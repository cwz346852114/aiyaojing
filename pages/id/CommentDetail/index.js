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
    inputValue: "",
    questionlist: [],
    positions: "bottom",
    load:true,
    page:1
  },
  getfouces() {
    this.setData({ positions: "top", shows: true });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    console.log(options)
    wx.checkSession({
      success() {},
      fail() {
        wx.redirectTo({
          url: `/pages/login/login/index?datatype=7&&id=${options.id}`
        });
      }
    });
    var values = wx.getStorageSync("sessionkey");
    var that = this;

    this.setData({
      approot: getApp().globalData.approot
    });
    wx.request({
      url: getApp().globalData.api + "&r=goods.remarkon.goodsRemarksDetails",
      data: {
        id: options.id,
        openid: values.openid
      },
      success(res) {
        var list1 = res.data;

        list1.create_time = util.formatDate1(list1.create_time * 1000);
        that.setData({
          list: list1
        });
        wx.request({
          url: getApp().globalData.api + "&r=goods.replylist",
          
          data: {
            id: options.id,
            page:1
          },
          success(res) {
            console.log(res.data);
            that.setData({
              questionlist: res.data.questionlist
            });
          }
        });
      }
    });
  },
  fangda(e) {
    let index = e.currentTarget.dataset.index;
    let imgArr = [];
    for (var i = 0; i < this.data.list.images.length; i++) {
      imgArr[i] = this.data.approot + this.data.list.images[i].image;
    }
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
    });
  },
  dianzan(e) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    var id = e.currentTarget.dataset.id;
    var isfavorite = this.data.list.deleted;
    // console.log(isfavorite);
    var number = parseInt(this.data.list.zan_count);
    const row = `list.deleted`;
    const sum = `list.zan_count`;
    isfavorite = !isfavorite;
    if (isfavorite) {
      isfavorite = 1;
    } else if (!isfavorite) {
      isfavorite = 0;
    }

    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=goods.remarkon.deletedRemarks",
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
  bindKeyInput(e) {
    console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    });
  },
  tiwen() {
    if (this.data.inputValue == "") {
      wx.showToast({
        title: "评论内容不得为空",
        icon: "none"
      });
      return false;
    }
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=goods.answer",
      data: {
        commentid: that.options.id,
        content: that.data.inputValue,
        openid: values.openid
      },
      success(res) {
        console.log(res.data.error)
        if(res.data.error!=0){
          wx.showToast({
            title:"添加失败"
          })
          return false
        }
        wx.showToast({
          title:"添加成功"
        })

        wx.request({
          url: getApp().globalData.api + "&r=goods.replylist",
          data: {
            id: that.options.id
          },
          success(res) {
            console.log(res.data);
            that.setData({
              questionlist: res.data.questionlist,
              inputValue:"",
              shows:false,
              positions: "bottom"
            });
          }
        }); 
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
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
   
      wx.request({
        url:getApp().globalData.api + "&r=goods.replylist",
        method: "get",
        data: {
          id: that.options.id,
          page:that.data.page+1
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          wx.hideLoading();
         
          if (res.data.questionlist && res.data.questionlist.length > 0) {
            var content = that.data.questionlist.concat(res.data.questionlist);
            //将放回结果放入content
            that.setData({
              load: true,
              questionlist: content
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

  }
});
