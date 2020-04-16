// pages/circle/addTieList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    img:"/image/y-heart.png",
    img1:"/image/wheart.png",
    approot:"",
    page:1,
    load:true
  },
  ToDetail1(e){
    console.log(e)
    var id = e.currentTarget.dataset.good_id;
    wx.navigateTo({
      url: `/pages/index/index?id=${id}`
    });
  },
  ToChong(e) {
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: `/pages/Socialcontact/otherList/index?openid=${openid}`
    });
  },
  dianzan(e){
    var that = this
    const id = this.data.list.id
     var isfavorite = this.data.list.is_deleted
     var number =  parseInt(this.data.list.zan_count)
    console.log(number)
     const row = `list.is_deleted`
     const sum = `list.zan_count`
     isfavorite =!isfavorite
     if(isfavorite){
      isfavorite= 1
     }else if(!isfavorite){
      isfavorite = 0
     }
     
    var values = wx.getStorageSync('sessionkey')
    wx.request({
      url:getApp().globalData.api+"&r=sns.post.fabulousPost",
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
  fangda(e) {

    let index = e.currentTarget.dataset.index;
    let imgArr = [];
    for (var i = 0; i < this.data.list.images.length; i++) {
      imgArr[i] = this.data.approot+ this.data.list.images[i].image
    }
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
    });
  },  
  ToPin(){
    const  query = wx.createSelectorQuery();
    query.select('#pin').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res)=>{
      if(res[0] &&res[1]){
        wx.pageScrollTo({
          scrollTop:res[0].top+res[1].scrollTop,
          duration:300
        })
      }
    })
  },
  shenping(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:`/pages/circle/pingDetail/index?id=${id}`
    })
  },
  zanPin(){
    var that =this
    var id= this.data.list.post_comment_list[0].id
    console.log(id)
    var isfavorite =  this.data.list.post_comment_list[0].is_deleted
    console.log(isfavorite)
     var number =  parseInt( this.data.list.post_comment_list[0].zan_count)
     console.log(number)
     const row = `list.post_comment_list[0].is_deleted`
     const sum = `list.post_comment_list[0].zan_count`
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
  ToQuan(e) {
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: `/pages/circle/tiebalist/index?id=${id}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.checkSession({
      success() {  
      },
      fail() {
       wx.redirectTo({
           url:`/pages/login/login/index?datatype=4&&id=${options.id}`
       })
      }
    });
    console.log(options)
    this.setData({
      approot:getApp().globalData.approot
    })
    var that = this
    var values = wx.getStorageSync("sessionkey")
    wx.request({
      url:getApp().globalData.api+"&r=sns.post.postCommentReply",
      data:{
        id:options.id,
        openid:values.openid
      },
      success(res){
        that.setData({
          list:res.data.list
        })
          console.log(res.data)
      }
    })
    wx.request({
      url:getApp().globalData.api+"&r=sns.post.commentList",
      data:{
        id:options.id,
        openid:values.openid,
        page:1,
        psize:10
      },
      success(res){
        console.log(res.data.list)
        that.setData({
          list1:res.data.list
        })
      }

    })
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
              list1:res.data.list,
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
  dianzan1(e){
    var that = this
    var id = e.currentTarget.dataset.id
     var index = e.currentTarget.dataset.index
     var isfavorite = this.data.list1[index].is_deleted

   
     var number =  parseInt(this.data.list1[index].zan_count)
  
     const row = `list1[${index}].is_deleted`
     const sum = `list1[${index}].zan_count`
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
    var that = this;
    var values = wx.getStorageSync("sessionkey")
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.load) {
      that.setData({
        load: false
      });
  
      wx.request({
        url:getApp().globalData.api+"&r=sns.post.commentList",
        method: "get",
        data: {
          id:that.options.id,
          openid:values.openid,
          page:this.data.page+1,
          psize:10
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          wx.hideLoading();
         
          if (res.data.list && res.data.list.length > 0) {
            var content = that.data.list1.concat(res.data.list);
            //将放回结果放入content
            that.setData({
              load: true,
              list1: content
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
  },

  /**
   * 用户点击右上角分享
   */

})