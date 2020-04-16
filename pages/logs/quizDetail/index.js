// pages/logs/quizDetail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    shows: false,
    positions: "bottom",
    inputValue: "",
    list: [],
    answer:[],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=goods.goodsQuestionDetails",
      data: {
        id: this.options.id,
        page: 1,
        pagesize: 10
      },
      success(res) {
        
        that.setData({
          list: res.data.list
        });
        if(res.data.list.answer &&res.data.list.answer.length>0){
          that.setData({
            answer: res.data.list.answer
          });
        }
      }
    });
  },
  huida() {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    if(this.data.inputValue==""){
      wx.showToast({
        title:"回答不得为空",
        icon:"none"
      })
      return false
    }
    if(this.data.inputValue.length<4){
      wx.showToast({
        title:"回答长度不得小于4个字符",
        icon:"none"
      })
      return false
    }
    wx.request({
      url: getApp().globalData.api + "&r=goods.goodsAnswer",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: values.openid,
        question_id: that.options.id,
        content: that.data.inputValue,
        good_id: that.options.good_id
      },
      success(res) {
        wx.showToast({
          title:"回复成功"
        })
        that.setData({ positions: "bottom", shows: false, inputValue: "" });
        wx.request({
          url: getApp().globalData.api + "&r=goods.goodsQuestionDetails",
          data: {
            id: that.options.id,
            page: 1,
            pagesize: 10
          },
          success(res) {
            
            that.setData({
              list: res.data.list
            });
            if(res.data.list.answer &&res.data.list.answer.length>0){
              that.setData({
                answer: res.data.list.answer
              });
            }
          }
        });
      }
    });
  },
  shuaxin() {
    var that = this;
    wx.request({
      url: getApp().globalData.api + "&r=goods.goodsQuestionDetails",
      data: {
        id: that.options.id,
        page: 1,
        pagesize: 10
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
   
      }
    });
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
  }
});
