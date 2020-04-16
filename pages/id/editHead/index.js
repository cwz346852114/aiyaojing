var util = require("../../../utils/time.js");
const app = getApp();
const global = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    radio: 0,
    loading: false, //控制提交表单
    lei: 0,
    jueyu: 0,
    names: "",
    pinzhong: "",
    tizong: "",
    img: "",
    loading: false,
    currentDate: new Date().getTime(),
    list: {},
    post: "",
    breed_id: "",
    minTime: new Date(1990, 1, 1).getTime(),
    kg: "kg",
    birthday:"",
    load:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    this.setData({
      post: getApp().globalData.approot
    });
    wx.request({
      url: getApp().globalData.api + "&r=pet.pet_details",
      data: {
        id: options.id,
        openid: values.openid
      },
      success(res) {
        var list = res.data.list;

        list.birthday = util.formatDate1(list.birthday * 1000);

        that.setData({
          list: list
        });
      }
    });
  },
  onInput(event) {
    this.setData({
      "list.birthday": util.formatDate1(event.detail).replace(/^\s+|\s+$/g, ""),
      show: false
    });
  },
  Tolei() {
    wx.navigateTo({
      url: `/pages/id/choose/index?id=${this.data.list.nationality}`
    });
  },
  validateNumber(val) {
    return val.replace(/[^u4e00-u9fa5w]/g, ""); //只能输入英文字母
  },
  name(e) {
    this.setData({
      "list.pet_name": e.detail
    });
  },
  tizhong(e) {
    this.setData({
      "list.weight": e.detail
    });
  },
  shengri(e) {
    this.setData({
      "list.birthday": this.data.list.birthday
    });
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({ show: false });
  },
  onshow() {
    this.setData({ show: true });
  },
  //上传头像
  unload() {
    var that = this;
    wx.chooseImage({
      success(res) {
        const pic = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.api + "&r=util.uploader.upload2&file=file",
          filePath: pic[0],
          name: "file",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },

          success(res) {
            var img = JSON.parse(res.data);
            that.setData({
              "list.head_img": img.files[0].filename
            });
          },
          fail(res) {}
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },
  changeData: function() {
    var id = app.id;
    var breed_name = app.breed_name;
    this.setData({
      pinzhong: breed_name,
      breed_id: id
    });
  
},
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
  show() {
    this.setData({
      kg: ""
    });
  },
  //输入框失去焦点
  hide() {
    if (this.data.list.weight == "") {
      console.log(1);
      return false;
    }
    this.setData({
      kg: "kg"
    });
  },
  // 创建身份证
  onClose3() {
    if (this.data.loading == false) {
      var values = wx.getStorageSync("sessionkey");
      var that = this;
      if (this.data.list.breed_id == "" && this.data.breed_id == "") {
        console.log(11);
        wx.showToast({
          title: "请选择宠物id",
          icon: "none"
        });
        return false;
      }
      if (this.data.list.pet_name == "") {
        wx.showToast({
          title: "请填写宠物名字",
          icon: "none"
        });
        return false;
      }
      if (this.data.list.weight == "") {
        wx.showToast({
          title: "请填写体重",
          icon: "none"
        });
        return false;
      }
      this.setData({
        loading: true
      });
      console.log(this.data.list.sex);
      if (this.data.list.sex == 1) {
        this.data.list.sex = "男";
      } else if (this.data.list.sex == 2) {
        this.data.list.sex = "女";
      }
      var data = {
        id: this.options.id,
        openid: values.openid,
        pet_name: this.data.list.pet_name,
        sex: this.data.list.sex,
        nationality: this.data.list.nationality,
        breed_id: this.data.breed_id
          ? this.data.breed_id
          : this.data.list.breed_id,
        birthday: this.data.list.birthday,
        weight: parseFloat(this.data.list.weight).toFixed(1),
        is_sterilization: this.data.list.is_sterilization == true ? 1 : 2,
        head_img: this.data.list.head_img
      };
      if(this.data.load){
        this.setData({
          load:false
        })
      }else{
        return false
      }
      wx.request({
        url: getApp().globalData.api + "&r=pet.update_pet_card",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data,
        success(res) {
          that.setData({
            load:true
          })
          wx.showLoading({
            title: "加载中"
          });
          setTimeout(function() {
            wx.hideLoading();
            wx.reLaunch({
              url: "/pages/id/list/index"
            });
          }, 2000);
        },
        fail(res) {
          wx.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    }
  },
  onChange1(event) {
    console.log(event);
    this.setData({
      "list.sex": event.detail
    });
  },
  onChange2(event) {
    console.log(event);
    this.setData({
      "list.sex": event.detail
    });
  },
  onChange3(event) {
    if (this.data.list.nationality != event.detail) {
      this.setData({
        "list.breed_name": "",
        "list.breed_id": "",
        pinzhong: "",
        breed_id: ""
      });
    }
    this.setData({
      "list.nationality": event.detail
    });
  },
  onChange4(event) {
    if (this.data.list.nationality != event.detail) {
      this.setData({
        "list.breed_name": "",
        "list.breed_id": "",
        pinzhong: "",
        breed_id: ""
      });
    }
    this.setData({
      "list.nationality": event.detail
    });
  },
  onChange5(event) {
    this.setData({
      "list.is_sterilization": event.detail
    });
  },
  onChange6(event) {
    this.setData({
      "list.is_sterilization": event.detail
    });
  }
});
