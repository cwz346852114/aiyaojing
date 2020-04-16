//logs.js
const util = require("../../utils/util.js");

Page({
  data: {
    logs: [],
    show: true,
    shows: false,
    positions: "bottom",
    inputValue: "",
    list:[],
    good_title:"",
    quest:""
  },
  onLoad: function(options) {

    var that = this

    wx.request({
      url: getApp().globalData.api + "&r=goods.goodsQuestionList",
      data: {
        good_id: options.id,
        page: 1,
        pagesize: 10
      },
      success(res){  
 
        that.setData({
          quest:res.data.good_detail.question_total,
          good_title:res.data.good_detail.good_title,
          list:res.data.list
        })
      }
    });
  },
  
  toDetail(e) {
    var id = e.currentTarget.dataset.id
    var good_id = this.options.id

    wx.navigateTo({
      url: `/pages/logs/quizDetail/index?id=${id}&&good_id=${good_id}`
    });
  },
  getfouces() {
    this.setData({ positions: "top", shows: true });
  },
  onClose() {
    this.setData({ positions: "bottom", shows: false, inputValue: "" });
  },
  bindKeyInput: function(e) {

    this.setData({
      inputValue: e.detail.value
    });
  },
  tiwen(){
    var that =this
    if(this.data.inputValue==""){
      wx.showToast({
        title:"提问内容不得为空",
        icon:"none"
      })
      return false
    }
    if(this.data.inputValue.length<4){
      wx.showToast({
        title:"提问长度不得小于4个字符",
        icon:"none"
      })
      return false
    }
    var values = wx.getStorageSync('sessionkey')
    wx.request({
      url:getApp().globalData.api+"&r=goods.goodsQuestion",
      method:'POST',
      header:{
        "Content-Type":"application/x-www-form-urlencoded"
      },
      data:{
        openid:values.openid,
        good_id:this.options.id,
        content:that.data.inputValue
      },
      success(){
        wx.showToast({
          title:"提问成功"
        })
        that.setData({ positions: "bottom", shows: false, inputValue: "" });
        that.shuaxin()
      }
    })
  },
  shuaxin(){
    var that = this
    wx.request({
      url: getApp().globalData.api + "&r=goods.goodsQuestionList",
      data: {
        good_id: this.options.id,
        page: 1,
        pagesize: 10
      },
      success(res){
        that.setData({
          quest:res.data.good_detail.question_total,
          good_title:res.data.good_detail.good_title,
          list:res.data.list
        })
      }
    });
  }
});
