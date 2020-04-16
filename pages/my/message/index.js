const openid = wx.getStorageSync("sessionkey").openid;
var util = require("../../../utils/time.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    sex: "",
    birthday: "",
    show:false,
    minTime:""
  },
  onChange1(e) {
    this.setData({
      name: e.detail
    });
  },
  onChange2(e) {
    // event.detail 为当前输入的值
    this.setData({
      phone: e.detail
    });
  },
  onChange3(e) {
    this.setData({
      sex: e.detail
    });
  },
  onChange4(e) {
    this.setData({
      sex: e.detail
    });
  },
  onChange5(e) {
    this.setData({
      birthday: e.detail
    });
  },
  submit() {
    var that = this;
    if(this.data.name==""){
      wx.showToast({
        title:"请输入姓名",
        icon:"none"
      })
      return false
    }
    if(this.data.phone.length!=11){
      wx.showToast({
        title:"请输入正确的电话号码",
        icon:"none"
      })
      return false
    }
    if(this.data.sex==""){
      wx.showToast({
        title:"请选择性别",
        icon:"none"
      })
      return false
    }
    if(this.data.birthday==""){
      wx.showToast({
        title:"请选择生日日期",
        icon:"none"
      })
      return false
    }
    if(this.data.sex==1){
      var sex = "男"
  }else{
    var sex = "女"
  }
   var data = {
      "memberdata[realname]": this.data.name,
      "memberdata[mobile]": this.data.phone,
      "memberdata[sex]": sex,
      "memberdata[birthday]": this.data.birthday,
      openid: openid
    }
    wx.request({
      url: getApp().globalData.api + "&r=member.info.submit",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
     data,
      success(res) {
        if(res.data.error!=0){
          wx.showToast({
            title:res.data.error,
            icon:"none"
          })
          return false
        }
        wx.showToast({
          title:"修改成功"
        })
        setTimeout(()=>{
         
          wx.reLaunch({
            url:"/pages/my/home/index"
          })
        },2000)
       
      }
    });
  },
  shengri(){
    this.setData({
      show: true
  });
  },
  onClose() {
    this.setData({ show: false });
},
  onInput(event) {
     
    this.setData({
        birthday: util
            .formatDate1(event.detail)
            .replace(/^\s+|\s+$/g, ""),
        show: false
    });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
    var that = this
    wx.request({
      url:getApp().globalData.api+"&r=member.info",
      data:{
        openid:openid
      },
      success(res){
          console.log(res.data.member)
        if(res.data.member.sex=="男"){
          var sex = 1
        }else if(res.data.member.sex=="女"){
          var sex = 2
        }else{
          var sex  = res.data.member.sex
        }
        that.setData({
          name:res.data.member.realname,
          phone:res.data.member.mobile,
          birthday:res.data.member.birthday,
          sex:sex
        })
      }
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
  onReachBottom: function() {},

});
