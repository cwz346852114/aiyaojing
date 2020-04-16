// pages/circle/pingDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    inputValue:"",
    img:"/image/y-heart.png",
    img1:"/image/wheart.png",
  },
  dianzan(e){
    var that = this
    var id = this.data.list.id

     var isfavorite = this.data.list.deleted
    
     var number =  parseInt(this.data.list.zan_count)
  
     const row = `list.deleted`
     const sum = `list.zan_count`
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
      url:getApp().globalData.api+"&id=1&r=sns.post.replyDetails",
      data:{
        id:options.id,
        openid:values.openid
      },
      success(res){
        that.setData({
          list:res.data.list
        })
      }
  })
  },
  ToChong(e) {
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: `/pages/Socialcontact/otherList/index?openid=${openid}`
    });
  },
  bindKeyInput(e){
    this.setData({
      inputValue:e.detail.value
    })
  },
  submit(){
    var that = this
    var values = wx.getStorageSync("sessionkey")
    wx.request({
      url:getApp().globalData.api+"&r=sns.post.postReply",
      method:'POST',
      header:{
        "Content-type":"application/x-www-form-urlencoded"
      },
      data:{
        comment_id:that.options.id,
        openid:values.openid,
        reply_msg:that.data.inputValue,
        to_openid:that.data.list.openid,
      },
      success(res){
        wx.request({
          url:getApp().globalData.api+"&id=1&r=sns.post.replyDetails",
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