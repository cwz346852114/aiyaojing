// pages/release/selectGoods/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    key:"",
    page:1,
    load:true,
    type:"",
    approot:""
  },
  shuru(e) {
    this.setData({
      key: e.detail.value
    });
  },
  sousuo() {
    var key = this.data.key.replace(" ", "");
    var that =this
    wx.request({
      url: getApp().globalData.api + "&r=goods.get_list",
      data: {
        nationality: that.options.id ? that.options.id : "",
        page: 1,
        keywords:key
      },
      success(res) {
        if(res.data.list &&res.data.list.length>0){
          that.setData({
            list: res.data.list
          });
          return false
        }
        that.setData({
          list:[]
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      console.log(options.type)
    var values = wx.getStorageSync("sessionkey")
    var that = this
    this.setData({
      type:options.type,
      approot:getApp().globalData.approot
    })
    var that = this;

    options.type==1?"&r=goods.get_list":""
    if(options.type==1){
      wx.request({
        url: getApp().globalData.api + "&r=goods.get_list",
        data: {
          nationality: options.id ? options.id : "",
          page: 1
        },
        success(res) {
          that.setData({
            list: res.data.list
          });
        }
      });
      return false
    }
      wx.request({
        url: getApp().globalData.api + "&r=sns.post.getlist",
        data: {
          type:2,
          openid: values.openid
        },
        success(res) {
   var list = res.data.mylist
          for(var i=0;i<list.length;i++){
              list[i].logo = that.data.approot+  list[i].logo
          }
          that.setData({
            list: list,

          });
        }
      });
  },
  select(e) {
    console.log(e)
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var values = wx.getStorageSync("sessionkey");
    if(this.data.type==1){
      wx.request({
        url: getApp().globalData.api + "&r=goods.remarkon.goods",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          openid: values.openid,
          goods_id: e.currentTarget.dataset.id,
          goods_name: that.data.list[index].title
        },
        success(res) {
          console.log(res.data)
          that.changeParent();
          wx.navigateBack({
            delta: 1
          });
        }
      });
    return false     
    }
    var logo = e.currentTarget.dataset.logo;
    var title = e.currentTarget.dataset.title;
    wx.setStorage({
      key:"circle",
      data:{
        logo:logo,
        title:title,
        id:id
      }
    })
    that.changeParent1();
    wx.navigateBack({
      delta: 1
    });

  },
  changeParent() {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData(); //触发父页面中的方法
    }
  },
  //圈子列表
  changeParent1() {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData1(); //触发父页面中的方法
    }
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
        url: global.api + "&r=goods.get_list",
        method: "get",
        data: {
          nationality: that.options.id ? that.options.id : "",
          page: that.data.page+1
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          wx.hideLoading();
         
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
