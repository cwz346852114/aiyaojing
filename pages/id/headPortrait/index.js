const app = getApp();
const global = app.globalData;
var util = require("../../../utils/time.js");
var  QQMapWX=require("../../../utils/qqmap-wx-jssdk");
var qqmapsdk = new QQMapWX({
  key: 'ETNBZ-WIOE6-GWFSF-EFXB2-KRHVV-YHBPG' // 必填
});  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    load:true,
    radio: 0,
    loading: false, //控制提交表单
    lei: 0,
    jueyu: 0,
    names: "",
    pinzhong: "",
    tizhong: "",
    img: "",
    img1: "/image/idcard/moren.png",
    loading: false,
    date: "",
    currentDate: new Date().getTime(),
    zhuangtai: false,
    post: "",
    minTime: new Date(1990, 1, 1).getTime(),
    kg: "",
    num: 0,
    adcode:'',//获取区号
  },
  onInput(event) {
    this.setData({
      currentDate: util.formatDate1(event.detail).replace(/^\s+|\s+$/g, ""),
      show: false,
      num: 1
    });
  },
  //选品种
  Tolei() {
    if (this.data.lei == 1 || this.data.lei == 2) {
      wx.navigateTo({
        url: `/pages/id/choose/index?id=${this.data.lei}`
      });
      return false;
    }

    wx.showToast({
      title: "请选择宝贝国籍",
      icon: "none"
    });
  },
  validateNumber(val) {
    return val.replace("^[\u4e00-\u9fa5_a-zA-Z0-9]+$"); //只能输入汉字和英文字母
  },
  name(e) {
    var value = this.validateNumber(e.detail);
    console.log(value);
    this.setData({
      names: value
    });
  },
  tizhong(e) {
    this.setData({
      tizhong: e.detail
    });
  },
  shengri(e) {
    this.setData({
      show: true,
      currentDate: this.data.currentDate
    });
  },
  onClose() {
    this.setData({ show: false });
  },
  onshow() {
    this.setData({ show: true });
  },
  //输入框获得焦点
  show() {
    this.setData({
      kg: ""
    });
  },
  //输入框失去焦点
  hide() {
    if (this.data.tizhong == "") {
      console.log(1);
      return false;
    }
    console.log;
    this.setData({
      kg: "kg"
    });
  },
  //上传头像
  unload() {
    var that = this;
    wx.chooseImage({
      count: 1, 
      success(res) {
        const pic = res.tempFilePaths[0];
        wx.navigateTo({
          url: `/pages/id/caijian/index?src=${pic}`,
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      if(options.src){
        this.setData({
          zhuangtai:true,
          img:options.src
        })
      }
    this.setData({
      post: getApp().globalData.approot
    });
    this.location()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  changeData: function() {
    var id = app.id;
    var breed_name = app.breed_name;
    console.log()
    this.setData({
      pinzhong: breed_name,
      breed_id: id
    });
  },
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
  onReachBottom: function() {},

  // 创建身份证
  onClose3() {

    if(this.data.adcode==''){
      this.location()
    }
    if (this.data.loading == false) {
      var values = wx.getStorageSync("sessionkey");
      var that = this;
      var data = {
        openid: values.openid,
        pet_name: this.data.names,
        sex: this.data.radio == 1 ? "男" : "女",
        nationality: this.data.lei,
        breed_id: this.data.breed_id,
        birthday: this.data.currentDate,
        weight: parseFloat(this.data.tizhong).toFixed(1),
        is_sterilization: this.data.jueyu == true ? 1 : 2,
        head_img: this.data.img,
        adcode:this.data.adcode,//获取区号
      };
      if (this.data.names == "") {
        wx.showToast({
          title: "请填写宠物名字",
          icon: "none"
        });
        return false;
      }
      if (this.data.radio == 0) {
        wx.showToast({
          title: "请选择性别",
          icon: "none"
        });
        return false;
      }
      if (this.data.lei == 0) {
        wx.showToast({
          title: "请选择国籍",
          icon: "none"
        });
        return false;
      }
      if (this.data.breed_id == "") {
        wx.showToast({
          title: "请选择品种",
          icon: "none"
        });
        return false;
      }
      if (this.data.currentDate == "") {
        wx.showToast({
          title: "请选择出生日期",
          icon: "none"
        });
        return false;
      }
      if (this.data.tizhong == "") {
        wx.showToast({
          title: "请填写体重",
          icon: "none"
        });
        return false;
      }
      if (this.data.jueyu == 0) {
        wx.showToast({
          title: "请选择是否绝育",
          icon: "none"
        });
        return false;
      }
      if (this.data.img == "") {
        wx.showToast({
          title: "请选择上传头像",
          icon: "none"
        });
        return false;
      }
      if(this.data.load){
        this.setData({
          load:false
        })
      }else{
        return false
      }
      wx.request({
        url: global.api + "&r=pet.create_pet_card",
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
          if (res.data.error == 1) {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            });
            return false;
          }

          wx.showToast({
            title: "添加成功"
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
    this.setData({
      radio: event.detail
    });
  },
  onChange2(event) {
    this.setData({
      radio: event.detail
    });
  },
  onChange3(event) {
    if (this.data.lei != event.detail) {
      this.setData({
        pinzhong: "",
        breed_id: ""
      });
    }
    this.setData({
      lei: event.detail
    });
  },
  onChange4(event) {
    if (this.data.lei != event.detail) {
      this.setData({
        pinzhong: "",
        breed_id: ""
      });
    }
    this.setData({
      lei: event.detail
    });
  },
  onChange5(event) {
    this.setData({
      jueyu: event.detail
    });
  },
  onChange6(event) {
    this.setData({
      jueyu: event.detail
    });
  },
   /**
   * 微信定位
   */
  location(){
    var that=this;
    //获取微信定位
    wx.getLocation({
     type: 'wgs84',
     success (res) {
 
       if(res && res.latitude && res.longitude){
         var latitude = res.latitude,longitude = res.longitude
         var a= that.loadcity(latitude,longitude);
         return a//定义一个函数获取 百度地图api获取当前城市的区号
       }else{
         return false;
           // wx.showToast({
           //   title:'获取失败',
           //   icon:'loading',
           //   duration:1000,
           //   make:true
           // })
       }
      
     },
     fail(res){
       console.log("获取定位失败....",res)
       return false;
       // wx.showModal({
       //   title:'获取定位失败',
       //   icon:'error',
       //   duration:3000,
       //   // content:'获取定位失败',
       // })
     }
   
    })
 },
 loadcity(latitude,longitude){
  var _this = this;
  console.log(latitude,longitude)
  qqmapsdk.reverseGeocoder({
    //位置坐标，默认获取当前位置，非必须参数
    /**
     * 
     //Object格式
      location: {
        latitude: 39.984060,
        longitude: 116.307520
      },
    */
    /**
     *
     //String格式
      location: '39.984060,116.307520',
    */
    location: {
      latitude: latitude,
      longitude: longitude
    }, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
    success: function(res) {//成功后的回调
      var res = res.result;
      console.log(res.ad_info.adcode)
     
      _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
        adcode: res.ad_info.adcode,
      });
      return res.ad_info.adcode;
    },
    fail: function(error) {
      console.log(error)
    },
    complete: function(res) {
      console.log(res);
    }
  })
 }

  
});
