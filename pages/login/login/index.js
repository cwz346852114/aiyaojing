const app = getApp();

const global = app.globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    datatype: "",
    id: "",
    actor_id:"",
    openid:"",
    teamid:""
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var option = JSON.stringify(options)
    // wx.showModal({
    //   title:option
    // })
    if (this.options.datatype) {
      this.setData({
        id: options.id?options.id:"",
        datatype: options.datatype,
        actor_id:options.actor_id?options.actor_id:"",
        teamid:options.teamid?options.teamid:"",
        openid:options.openid
      });
    }

    var that = this;
    //判断授权状态
    wx.checkSession({
      success() {
        that.setData({
          show: true
        });
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/home/index"
          });
        }, 1000);
      },
      fail() {
        that.bindGetUserInfo();
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

  /**
   * 用户点击右上角分享
   */

  bindGetUserInfo(res) {
    let info = res;
    var that = this;
    if (info.detail.userInfo) {
      wx.login({
        success: function(res) {
          if (res.code) {
            wx.request({
              url: global.api + "&r=wxapp.login",
              data: {
                code: res.code,
                appid: global.appid
              },
              header: {},
              success: function(res) {
                wx.setStorage({
                  key: "sessionkey",
                  data: {
                    openid: "sns_wa_" + res.data.openid,
                    sessionid: res.data.session_key
                  }
                });
                wx.request({
                  url: global.api + "&r=wxapp.auth",
                  data: {
                    data: info.detail.encryptedData,
                    iv: info.detail.iv,
                    sessionKey: res.data.session_key,
                    openid: res.data.openid,
                    authkey: res.data.authkey
                  },
                  success(res) {
                    //设置用户信息本地存储
                    wx.setStorage({
                      key: "userInfo",
                      data: {
                        userInfo: res.data
                      }
                    });
                  }
                });
                //新人特惠
                if (that.data.datatype == 1) {
                  wx.redirectTo({
                    url: `/pages/fenxiao/Detail/index?id=${that.data.id}&&type=1`
                  });
                  return false;
                }
                //每日上新
                if (that.data.datatype == 2) {
                  wx.redirectTo({
                    url: `/pages/tehui/index?id=${that.data.id}`
                  });
                  return false;
                }
                //圈子广场
                if (that.data.datatype == 3) {
                  wx.reLaunch({
                    url: `/pages/circle/home/index`
                  });
                  return false;
                }
                //帖子详情
                if (that.data.datatype == 4) {
                  wx.redirectTo({
                    url: `/pages/circle/tieDetail/index?id=${that.data.id}`
                  });
                  return false;
                }
                //帖子列表
                if (that.data.datatype == 5 ){
                  wx.redirectTo({
                    url: `/pages/circle/tiebalist/index?id=${that.data.id}`
                  });
                  return false;
                }
                //普通商品
                if (that.data.datatype == 6) {
                  wx.redirectTo({
                    url: `/pages/index/index?id=${that.data.id}`
                  });
                  return false;
                }
                //点评详情
                if (that.data.datatype == 7) {
                  wx.redirectTo({
                    url: `/pages/id/CommentDetail/index?id=${that.data.id}`
                  });
                  return false;
                }
                //写真集
                if (that.data.datatype == 8 ){
                  wx.redirectTo({
                    url: `/pages/id/PhotoDetail/index?id=${that.data.id}`
                  });
                  return false;
                }
                //砍价
                if (that.data.datatype == 9 ){
            
                  wx.redirectTo({
                    url: `/pages/kanjia/listDetail/index?actor_id=${that.data.actor_id}&&id=${that.data.id}`
                  });
                  return false;
                }
                //拼团
                if (that.data.datatype == 10 ){
                          
                  wx.redirectTo({
                    url: `/pages/pintuan/Detail/index?teamid=${that.data.teamid}`
                  });
                  return false;
                }     
                if (that.data.datatype == 11 ){
                  wx.redirectTo({
                    url: `/pages/Socialcontact/otherList/index?openid=${that.data.openid}`
                  });
                  return false;
                }     
              
                wx.reLaunch({
                  url: "/pages/home/index"
                });
                
              }
            });
          } else {
          }
        }
      });
    } else {
    }
  }
});
