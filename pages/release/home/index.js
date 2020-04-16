// pages/release/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    circleList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var values = wx.getStorageSync('sessionkey')
    var that = this
    if(values.openid){
      this.setData({
        openid:values.openid
      })
    }else{
      this.setData({
        openid:""
      })
    }
    wx.request({
      url:getApp().globalData.api+"&r=pet.get_list",
      data:{
        openid:values.openid,
        page:1,
        pagesize:10,
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


  dianping(){

    if(this.data.list.length>0){
      wx.navigateTo({
        url:"/pages/release/review/index"
      })
      return false
    }
 
    wx.showToast({
      title: '请先添加宠物身份证',
      icon: 'none',
      duration: 1000
    })
  
  },
  id(){
 
    wx.navigateTo({
      url:"/pages/id/headPortrait/index"
    })
  },
  xiezhen(){
    if(this.data.list.length>0){
      wx.navigateTo({
        url:"/pages/release/photo/index"
      })
      return false
    }
    wx.showToast({
      title: '请先添加宠物身份证',
      icon: 'none',
      duration: 1000
    })
  
  },
  cricle(){
    var values = wx.getStorageSync("sessionkey")
    var that = this
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.getMelist",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          show: true
        });
        console.log(res.data.mylist)
        if(res.data.mylist&&res.data.mylist.length>0){
         wx.navigateTo({
          url:"/pages/circle/addCircle/index"
        })
        return false
        }
        wx.navigateTo({
          url:"/pages/circle/yindao/index"
        })
      }
    });
   
  },
  onClose1(){
    this.setData({
      shows:false
    })
  },
  tankuang(){
    this.setData({
      shows:true
    })
  },
  login(){
    wx.navigateTo({
      url:"/pages/login/login/index"
    })
  },
 
})