 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: 3.5,
    show: 0,
    realHeight: 41,
    load:true,
    page:1,
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
    list: [],
    list1:[],
    image: "/image/zhankai.png",
    image1:"/image/shouqi.png",
    img: "/image/y-heart.png",
    img1: "/image/wheart.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      approot:getApp().globalData.approot
    })
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=goods.goodsQuestionAnswer",
      data: {
        good_id: options.id,
        openid: values.openid,
        breed_id:options.breed_id?options.breed_id:""
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=goods.remarkonList",
      data: {
        good_id: options.id,
        openid: values.openid,
        page:1,
        psize:10
      },
      success(res) {
        that.setData({
          list1: res.data.list
        });
      }
    });
  },
  fangda(e) {
    var list = this.data.list1
    var bindex= e.currentTarget.dataset.bindex
    var index =e.currentTarget.dataset.index
    let imgArr = [];
  
    for(var i =0;i<list[bindex].images.length;i++){
      imgArr[i] = this.data.approot+list[bindex].images[i].image;
    }
    console.log(imgArr)
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
    });
  },
  ToDetail(e){
    var openid = e.currentTarget.dataset.openid
    

    wx.navigateTo({
      url:`/pages/Socialcontact/otherList/index?openid=${openid}`
    })
  },
  ToChongPin(e){

    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:`/pages/id/CommentDetail/index?id=${id}`
    })
  },
  dianzan(e) {
  
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.bindex;
    var isfavorite = this.data.list1[index].deleted;
    // console.log(isfavorite);
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
        url: getApp().globalData.api + "&r=goods.remarkonList",
        method: "get",
        data: {
          good_id: options.id,
          openid: values.openid,
          page:this.data.page+1,
          psize:10
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          wx.hideLoading();
         
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
  xianshi(e) {
    var toggleBtnVal = this.data.show;
    var id = e.currentTarget.dataset.id;
    if (toggleBtnVal == id) {
      this.setData({
        show: 0
      });
    } else {
      this.setData({
        show: id
      });
    }
  },
  
});
