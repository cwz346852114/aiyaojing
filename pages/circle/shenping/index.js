// pages/circle/shenping/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
    list:[],
    img:"/image/y-heart.png",
    img1:"/image/wheart.png",
  },
  bindKeyInput(e){
    this.setData({
      inputValue:e.detail.value
    })
  },
  //发布评论
  submit(){
    var that = this
    var values = wx.getStorageSync("sessionkey")
    wx.request({
      url:getApp().globalData.api+"&r=sns.post.postComment",
      method:'POST',
      header:{
        "Content-type":"application/x-www-form-urlencoded"
      },
      data:{
        postid:that.options.id,
        openid:values.openid,
        reply_msg:that.data.inputValue
      },
      success(res){
        wx.request({
          url:getApp().globalData.api+"&r=sns.post.commentList",
          data:{
            id:that.options.id,
            openid:values.openid
          },
          success(res){
            console.log(res.data.list)
            that.setData({
              list:res.data.list,
              inputValue:""
            })
          }
    
        })
      }
    })
  },
  ToDetail(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:`/pages/circle/pingDetail/index?id=${id}`
    })
  },
  dianzan(e){
    var that = this
    var id = e.currentTarget.dataset.id
     var index = e.currentTarget.dataset.index
     var isfavorite = this.data.list[index].is_deleted
     console.log(isfavorite)
     var number =  parseInt(this.data.list[index].zan_count)
  
     const row = `list[${index}].is_deleted`
     const sum = `list[${index}].zan_count`
     isfavorite =!isfavorite
     if(isfavorite){
      isfavorite= 1
     }else if(!isfavorite){
      isfavorite = 0
     }
     
    var values = wx.getStorageSync('sessionkey')
    wx.request({
      url:getApp().globalData.api+"&r=sns.post.fabulousComment",
      data:{
        id:id,
        isfavorite:isfavorite,
        openid:values.openid
      },success(res){
        that.setData({
          [row]:res.data.isfavorite
        })
    
       if(res.data.isfavorite){
         number = number+1
        that.setData({
          [sum]:number
        })
       }else{
        number = number-1
        that.setData({
          [sum]:number
        })
       }
     
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var values = wx.getStorageSync("sessionkey")
    var that = this

    wx.request({
      url:getApp().globalData.api+"&r=sns.post.commentList",
      data:{
        id:options.id,
        openid:values.openid
      },
      success(res){
        console.log(res.data.list)
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