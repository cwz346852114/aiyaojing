// pages/search/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key:"",
    list:[]
  },
  sousuo(){
 
    var key = this.data.key.replace(" ","")
    if(key!=""){
      wx.navigateTo({
        url:`/pages/search/detail/index?id=${key}`
      })
    }
   
  },
  shuru(e){

    this.setData({
      key:e.detail.value
    })
  
  },
  clear(){

    this.setData({
      key:""
    })
    
  },
  remove(){
    wx.showToast({
      title:"功能未开放",
      icon:"none"
    })
  },
  history(){
    wx.showToast({
      title:"功能未开放",
      icon:"none"
    })
  },
  changyong(e){
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url:`/pages/search/detail/index?id=${name}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    var that =this
    wx.request({
      url:getApp().globalData.api+"&r=keyword.get_list",
      data:{
        page:1,
        position:1,
        pagesize:10
      },
      success(res){
      
        that.setData({
          list:res.data.list
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})