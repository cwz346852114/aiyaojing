const app = getApp();
const global = app.globalData;
var util = require("../../../utils/time.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    value: 3,
    show: false,
    list: [],
    list1: [],
    list2: [],
    post: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    this.setData({
      post: getApp().globalData.approot
    });
    wx.request({
      url: global.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list
        });
        if (that.data.list.length > 0) {
          wx.request({
            url:global.api+"&r=pet.getPetFoodCan",
            data:{
              frompetid:that.data.list[0].id,
              openid:values.openid,
              topetid:that.data.list[0].id
            },
            success(res){
          
              that.setData({
                petFoodCantotal:res.data.petFoodCantotal==null?0:res.data.petFoodCantotal,
                zan_count:res.data.zan_count,
              })
            }
          })
          wx.request({
            url: global.api + "&r=pet.attentionPetCardList",
            data: {
              openid: values.openid,
              petid: that.data.list[0].id,
              page: 1,
              psize: 10
            },
            success(res) {
              var list1 = res.data.list;
             
              that.setData({
                list1: list1
              });
            }
          });
          wx.request({
            url: global.api + "&r=pet.rankingList",
            data: {
              openid: values.openid,
              petid: that.data.list[0].id,
              page: 1,
              psize: 10
            },
            success(res) {
     
              
              that.setData({
                list2: res.data.list
              });
            }
          });
        }
      }
    });
  },
  jilu(){
    var id = this.data.list[0].id
    wx.navigateTo({
      url:`/pages/Socialcontact/jiLu/index?id=${id}`
    })
  },
  ToList1() {
    wx.navigateTo({
      url: `/pages/Socialcontact/list/index?id=${this.data.list[0].id}`
    });
  },
  ToList2() {
    wx.navigateTo({
      url: `/pages/Socialcontact/paihang/index?id=${this.data.list[0].id}`
    });
  },
  touguantou(e) {

    var id = e.currentTarget.dataset.id;
    var openid =  e.currentTarget.dataset.openid;
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: global.api + "&r=pet.stealCanned",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        frompetid:that.data.list[0].id,//自己的宠物id
        topetid:id,//偷取的宠物id
        fromopenid:values.openid,//自己的openid
        toopenid:openid,//偷取的openid
      },
      success(res){
        if(res.data.error!=0){
          wx.showToast({
            title:res.data.message,
            icon:"none"
          })
          return false
        }
        wx.showToast({
          title:`${res.data.list.msg}你偷了${res.data.list.pet_name}${res.data.list.num}个罐头`,
          icon:"none"
        })
        wx.request({
          url: global.api + "&r=pet.attentionPetCardList",
          data: {
            openid: values.openid,
            petid: that.data.list[0].id,
            page: 1,
            psize: 10
          },
          success(res) {
            var list1 = res.data.list;
            
            that.setData({
              list1: list1
            });
          }
        });
        wx.request({
          url:global.api+"&r=pet.getPetFoodCan",
          data:{
            frompetid:that.data.list[0].id,
            openid:values.openid,
            topetid:that.data.list[0].id
          },
          success(res){
        
            that.setData({
              petFoodCantotal:res.data.petFoodCantotal==null?0:res.data.petFoodCantotal,
              zan_count:res.data.zan_count,
              feed:res.data.feed
            })
          }
        })
      }
    });
  },
  toukan(e) {

    var openid = e.currentTarget.dataset.openid
    var id =  e.currentTarget.dataset.id
    wx.navigateTo({
      url:`/pages/Socialcontact/otherList/index?id=${id}&&openid=${openid}`
    })
  },
  toukan1(e) {

    var openid = e.currentTarget.dataset.openid
    var id =  e.currentTarget.dataset.topetid
    wx.navigateTo({
      url:`/pages/Socialcontact/otherList/index?id=${id}&&openid=${openid}`
    })
  },
  select(e) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    this.setData({
      col: e.currentTarget.dataset.index
    });
    wx.request({
      url: global.api + "&r=pet.update_default",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: values.openid,
        id: e.currentTarget.dataset.id
      },
      success() {
        wx.request({
          url: getApp().globalData.api + "&r=pet.get_list",
          data: {
            openid: values.openid
          },
          success(res) {
            that.setData({
              list: res.data.list
            });
            if (that.data.list.length > 0) {
              wx.request({
                url:global.api+"&r=pet.getPetFoodCan",
                data:{
                  frompetid:that.data.list[0].id,
                  openid:values.openid,
                  topetid:that.data.list[0].id
                },
                success(res){
              
                  that.setData({
                    petFoodCantotal:res.data.petFoodCantotal==null?0:res.data.petFoodCantotal,
                    zan_count:res.data.zan_count,
                  })
                }
              })
              wx.request({
                url: global.api + "&r=pet.attentionPetCardList",
                data: {
                  openid: values.openid,
                  petid: that.data.list[0].id,
                  page: 1,
                  psize: 10
                },
                success(res) {
                  var list1 = res.data.list;
                  
                  that.setData({
                    list1: list1
                  });
                }
              });
              wx.request({
                url: global.api + "&r=pet.rankingList",
                data: {
                  openid: values.openid,
                  petid: that.data.list[0].id,
                  page: 1,
                  psize: 10
                },
                success(res) {
        
                  that.setData({
                    list2: res.data.list
                  });
                }
              });
            }
          }
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

  onChange(event) {
    console.log(event)
    var values = wx.getStorageSync("sessionkey")
    var that = this
    if (event.detail.index == 0) {
      wx.request({
        url: global.api + "&r=pet.attentionPetCardList",
        data: {
          openid: values.openid,
          petid: that.data.list[0].id,
          page: 1,
          psize: 10
        },
        success(res) {
          var list1 = res.data.list;
         
          that.setData({
            list1: list1
          });
        }
      });

    } else {
   
    }
  }
});
