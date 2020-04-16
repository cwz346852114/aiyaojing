const app = getApp();

const global = app.globalData;
var openid = wx.getStorageSync("sessionkey");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    show1: false,
    page: 1, //页数
    leixing: 0,
    load: true, //状态
    value: 3,
    col: false,
    list: [],
    list1: [],
    imgUrls: [],
    text: ["测试数据1", "测试数据2", "测试数据3", "测试数据4", "测试数据5"],
    index: 0,
    mainActiveIndex: 0,
    activeId: null,
    items: [], //获取维度
    items1: [],
    items2: [],
    breed_name: "",
    type_name: "",
    classify_type: "",
    classify_filtrate: [],
    nationality: "",
    remarkon_comment: "",
    breed_id: "",
    name: "",
    checked: true,
    pet_name: "",
    title: "",
    approot: "",
    ids: [],
    zanwu: false,
    text: "",
    maxValue: "",
    minValue: "",
    pinzhong_name: "",
    lei:"",
    checklist:[
      { name: '全部', checked:""},
      { name: '能购买', checked: true},
      { name: '不能购买', checked: false}

  ],

  },
  tiao(e) {
    var link = e.currentTarget.dataset.link;

    wx.navigateTo({
      url: link
    });
  },
  //去商品详情
  routeShopDetail(event) {
    var id = event.currentTarget.id;
    var breed_id = this.data.breed_id
      ? this.data.breed_id
      : this.data.list1[0].breed_id;

    wx.navigateTo({
      url: `/pages/index/index?id=${id}&&breed_id=${breed_id}`
    });
  },
  sousuo() {
    var menu_id = this.options.id;
    wx.navigateTo({
      url: `/pages/search/result/index?id=1&&menu_id=${menu_id}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    wx.setNavigationBarTitle({
      title: this.options.title
    });
    this.setData({
      approot: getApp().globalData.approot
    });
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: global.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        if (res.data.list && res.data.list.length > 0) {
          that.setData({
            pinzhong_name: res.data.list[0].pet_name,
            list1: res.data.list,
            nationality: res.data.list[0].nationality
              ? res.data.list[0].nationality
              : ""
          });
        }
        console.log(11)
        that.setData({
          list1: res.data.list,
          nationality: 1
        });
        console.log(11)
        wx.request({
          url: global.api + "&r=goods.get_list",
          data: {
            openid: values.openid,
            menu_id: that.options.id,
            nationality:
              res.data.list.length > 0 ? res.data.list[0].nationality : "",
            breed_id: res.data.list.length!=0?res.data.list[0].breed_id:""
          },
          success(res) {
            wx.hideLoading({
              success() {
                that.setData({
                  zanwu: true
                });
              }
            });

            that.setData({
              list: res.data.list
            });
          }
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=pet.classify.getAllComment",
      data: {
        openid: values.openid,
        menu_id: that.options.id
      },
      success(res) {
        that.setData({
          items2: res.data.list
        });
      }
    });
    wx.request({
      url: global.api + "&r=shop.index.get_adv_list",
      data: {
        location: 2
      },
      success(res) {
        that.setData({
          imgUrls: res.data.data
        });
      }
    });
    wx.request({
      url: global.api + "&r=pet.classify.getAllBreed",
      data: {
        page: 1,
        openid: values.openid
      },
      success(res) {
        that.setData({
          text: res.data.list[0].text
        });
      }
    });
    wx.request({
      url: getApp().globalData.api + "&r=pet.classify.getAllBreed",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          items: res.data.list,
          pinzhong_name: res.data.list[0].text
        });
      }
    });
  },
  radio(event) {
    console.log(event)
    this.setData({
      radio: event.detail
    });
  },
  onReady: function() {},
  onChange(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var list = this.data.items;

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      for (let j = 0; j < element["children"].length; j++) {
        const element2 = element["children"][j];
        if (element2["id"] == id) {
          element2["checked"] = !element2["checked"];

          if (element2["checked"]) {
            this.data.ids.push(element2["id"]);
            this.setData({
              ids: this.data.ids
            });
          } else {
            for (let t = 0; t < this.data.ids.length; t++) {
              if (this.data.ids[t] == id) {
                this.data.ids.splice(t, 1);
              }
            }
          }
        }
      }
    }

    this.setData({
      items: list
    });
  },
  validateNumber(val) {
    return val.replace(/\D/g, "");
  },
  min(e) {
    let value = this.validateNumber(e.detail.value);
    this.setData({
      minValue: value
    });
  },
  max(e) {
    let value = this.validateNumber(e.detail.value);
    this.setData({
      maxValue: value
    });
  },
  //重置
  onClose4() {
    var list = this.data.items;
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      for (let j = 0; j < element["children"].length; j++) {
        const element2 = element["children"][j];
        element2["checked"] = false;
      }
    }
    this.setData({
      ids: [],
      minValue: "",
      maxValue: "",
      items: list
    });
  },
  //筛选提交
  onClose3() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    var maxValue = this.data.maxValue;
    var minValue = this.data.minValue;
    if (maxValue < minValue) {
      [maxValue, minValue] = [minValue, maxValue];
    }
    var ids = JSON.stringify(this.data.ids);

    wx.request({
      url: global.api + "&r=goods.get_list",
      data: {
        page: 1,
        openid: values.openid,
        breed_id: that.data.breed_id,
        classify_type: that.data.classify_type,
        classify_filtrate: ids,
        nationality: that.data.nationality,
        startPrice: minValue,
        endPrice: maxValue,
        remarkon_comment: that.data.remarkon_comment,
        menu_id: that.options.id,
        buy_status:that.data.lei
      },
      success(res) {
        that.setData({
          list: res.data.list,
          classify_filtrate: res.data.return_value.classify_filtrate,
          minValue: res.data.return_value.startPrice,
          maxValue: res.data.return_value.endPrice,
          show1: false
        });
      }
    });
  },
  zhuangtai1(event){
    console.log(event)
    this.setData({
      lei: event.detail
    });
  },
  zhuangtai2(event){
    console.log(event)
    this.setData({
      lei: event.detail
    });
  },
  zhuangtai3(event){
    console.log(event)
    this.setData({
      lei: event.detail
    });
  },
  he(e) {},
  search(e) {
    wx.showLoading({
      title: "加载中"
    });
    var values = wx.getStorageSync("sessionkey");
    const remarkon_comment = e.currentTarget.dataset.id;
    var that = this;
    const name = e.currentTarget.dataset.name;
    wx.request({
      url: global.api + "&r=goods.get_list",
      data: {
        page: 1,
        openid: values.openid,
        breed_id: that.data.breed_id,
        classify_type: that.data.classify_type,
        classify_filtrate: that.data.classify_filtrate,
        nationality: that.data.nationality,
        startPrice: that.data.minValue,
        endPrice: that.data.maxValue,
        remarkon_comment: remarkon_comment,
        menu_id: that.options.id
      },
      success(res) {
        wx.hideLoading();
        that.setData({
          list: res.data.list,
          remarkon_comment: remarkon_comment,
          show: false,
          name: name
        });
      }
    });
  },
  showPopup1() {
    var that = this;
    this.setData({
      leixing: 1,
      show: true,
      show1: false
    });
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=pet.classify.getAllBreed",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          items: res.data.list
        });
      }
    });
  },
  showPopup2() {
    var that = this;
    this.setData({
      leixing: 2,
      show: true,
      show1: false
    });
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=pet.classify.getAllType",
      data: {
        openid: values.openid,
        menu_id: that.options.id,
        nationality: that.data.nationality
      },
      success(res) {
        that.setData({
          items1: res.data.list
        });
      }
    });
  },
  showPopup3() {
    var that = this;
    this.setData({
      leixing: 3,
      show: true,
      show1: false
    });
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=pet.classify.getAllComment",
      data: {
        openid: values.openid,
        menu_id: that.options.id,
        nationality: that.data.nationality
      },
      success(res) {
        that.setData({
          items2: res.data.list
        });
      }
    });
  },
  showPopup4() {
    var that = this;
    this.setData({
      leixing: 4,
      show1: true,
      show: false
    });
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=pet.classify.getAllFiltrate",
      data: {
        openid: values.openid,
        menu_id: that.options.id,
        nationality: that.data.nationality
      },
      success(res) {
        var list = res.data.list;
        if (list) {
          let items = list.map((element, index) => {
            if (element["children"]) {
              element["children"].map(element2 => {
                let haveData = that.data.classify_filtrate.filter(
                  (item, index) => item == element2["id"]
                );
                if (haveData.length > 0) {
                  element2["checked"] = !element2["checked"];
                }
                return element;
              });
            }
            return element;
          });
          that.setData({
            items: items
          });
        }
      }
    });
  },
  close() {
    this.setData({
      show: false
    });
  },
  onClose() {
    this.setData({
      leixing: 0,
      show1: false
    });
  },

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    });
  },
  onClickItem({ detail = {} }) {
    wx.showLoading({
      title: "加载中"
    });
    const activeId = this.data.activeId === detail.id ? "" : detail.id;
    var values = wx.getStorageSync("sessionkey");
    this.setData({ activeId, show: false, pinzhong_name: detail.breed_name });
    var that = this;
    var nationality = 1;

    if (detail.breed_name == "全部猫猫") {
      nationality = 2;
    } else if (detail.breed_name == "全部狗狗") {
      nationality = 1;
    } else {
      nationality = detail.nationality_id;
    }
    if (this.data.leixing == 1) {
      wx.request({
        url: global.api + "&r=goods.get_list",
        data: {
          page: 1,
          openid: values.openid,
          breed_id: activeId,
          classify_type: that.data.classify_type,
          classify_filtrate: that.data.classify_filtrate,
          menu_id: that.options.id ? that.options.id : "",
          nationality: nationality,
          startPrice: that.data.minValue,
          endPrice: that.data.maxValue,
          remarkon_comment: that.data.remarkon_comment,
          menu_id: that.options.id
        },
        success(res) {
          wx.hideLoading();
          that.setData({
            pinzhong_name: detail.breed_name
          });
          if (that.data.nationality != res.data.return_value.nationality) {
            that.setData({
              ids: []
            });
          }
          that.setData({
            list: res.data.list,
            text: detail.breed_name,
            breed_id: res.data.return_value.breed_id,
            nationality: res.data.return_value.nationality
          });
        }
      });
    } else {
      wx.request({
        url: global.api + "&r=goods.get_list",
        data: {
          page: 1,
          openid: values.openid,
          breed_id: that.data.breed_id,
          classify_type: detail.id,
          classify_filtrate: that.data.classify_filtrate,
          nationality: that.data.nationality,
          startPrice: that.data.minValue,
          endPrice: that.data.maxValue,
          remarkon_comment: that.data.remarkon_comment,
          menu_id: that.options.id
        },
        success(res) {
          wx.hideLoading();
          that.setData({
            type_name: detail.type_name,
            list: res.data.list,
            classify_type: res.data.return_value.classify_type
          });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

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
          page: this.data.page + 1,
          openid: openid.openid,
          pagesize: 10,
          breed_id: that.data.breed_id,
          classify_type: that.data.classify_type,
          classify_filtrate: that.data.classify_filtrate,
          nationality: that.data.nationality,
          startPrice: that.data.startPrice ? that.data.startPrice : "",
          endPrice: that.data.endPrice ? that.data.endPrice : "",
          remarkon_comment: that.data.remarkon_comment,
          menu_id: that.options.id
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
  }
});
