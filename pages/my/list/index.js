const app = getApp();
const global = app.globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      normal: "/image/my/yuan.png",
      active: "/image/my/icon_xuanz.png"
    },
    list1: [],
    isdefault: 0,
    shows: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  changeParentData: function() {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData(); //触发父页面中的方法
    }
  },

  onChange(event) {
    var that = this;
    var { index } = event.currentTarget.dataset;
    console.log(index)
    
    var values = wx.getStorageSync("sessionkey");

    wx.request({
      url: global.api + "&r=member.address.set_default",
      data: {
        id: that.data.list1[index].id,
        openid: values.openid
      },
      success(res) {
        wx.request({
          url: global.api + "&r=member.address.get_list",
          method: "GET",
          header: {
            "content-type": "application/json"
          },
          data: {
            openid: values.openid
          },
          success(res) {
            console.log(res.data.list);
            that.setData({
              list1: res.data.list
            });
          }
        });
      }
    });
  },
  SelectDizhi(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    if (this.options.id == 0) {
      wx.setStorage({
        key: "options",
        data: {
          id:id
        }
      });
      this.changeParentData();
      wx.navigateBack({
        delta: 1
      });
    }
  },
  onShow() {
    this.setData({
      shows: this.options
    });
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: global.api + "&r=member.address.get_list",
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      data: {
        openid: values.openid
      },
      success(res) {
        console.log(res.data.list);
        that.setData({
          list1: res.data.list
        });
      }
    });
  },
  add() {
    wx.navigateTo({
      url: "/pages/my/detail/index"
    });
  },
  //修改收货地址
  detail(e) {
    wx.navigateTo({
      url: `/pages/my/edit/index?id=${e.currentTarget.dataset.id}`
    });
  },
  // 删除收货地址
  remove(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var values = wx.getStorageSync("sessionkey");
    var id = e.currentTarget.dataset.id;
    if(this.data.list1[index].isdefault==1){
      wx.showToast({
        title:"默认地址不允许删除",
        icon:"none"
      })
      return false
    }
    wx.showModal({
      title: "提示",
      content: "是否确认删除",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: global.api + "&r=member.address.delete",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              id: id,
              openid: values.openid
            },
            success(res) {
              wx.request({
                url: global.api + "&r=member.address.get_list",
                method: "GET",
                header: {
                  "content-type": "application/json"
                },
                data: {
                  openid: values.openid
                },
                success(res) {
                  that.setData({
                    list1: res.data.list
                  });
                }
              });
            },
            fali(res) {
              console.log("删除失败");
            }
          });
        }
      }
    });
  }
});
