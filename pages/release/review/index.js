// pages/release/review/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    istrue: false,
    show: "",
    list1: [],
    creent: 0,
    goodsid: "",
    goods_name: "",
    zongping: 0,
    img: [],
    imgs: [],
    money: "",
    message: "",
    pet_id: "",
    remarkon_start: [],
    id: "",
    breed_id: "",
    nationality: "",
    approot: "",
    src: "",
    video: [],
    video1: [],
    name: "",
    good_img: "",
    load:true,
    link:"",
    show1:false
  },
  //上传图片
  unload() {
    var that = this;

    wx.chooseImage({
      sizeType: ['compressed'],
      success(res) {
        let pic = res.tempFilePaths;
        for (let i = 0; i < pic.length; i++) {
          wx.uploadFile({
            url: getApp().globalData.api + "&r=util.uploader.upload2&file=file",
            filePath: pic[i],
            name: "file",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
              var img = JSON.parse(res.data);
              console.log(img);
              that.data.imgs.push({ image: img.files[0].filename });

              that.setData({
                img: that.data.imgs
              });
            },
            fail(res) {}
          });
        }
      
      }
    });
  },
  //上传视频

  uploadVideo() {
    var that = this;
    wx.chooseVideo({
      maxDuration: 60,
      camera: "back",
      success: function(res) {
        that.setData({
          src: res.tempFilePath
        });
        wx.uploadFile({
          url:
            "https://admin.ayjpet.com/web/index.php?c=utility&a=file&do=upload&upload_type=video&global=&dest_dir=&uniacid=-1",
          filePath: that.data.src,
          name: "file", //服务器定义的Key值
          header: {
            "Content-Type": "multipart/form-data"
          },

          success: function(res) {
            var list = JSON.parse(res.data);
            console.log(list);

            if (list.error) {
              wx.showToast({
                title: list.message,
                icon: "none"
              });
            } else {
              wx.showToast({
                title: "上传成功"
              });
              that.data.video1.push({ video: list.url });
              that.setData({
                video: that.data.video1
              });
            }
          },
          fail: function() {
            console.log("接口调用失败");
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      approot: getApp().globalData.approot
    });
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    console.log(options);
    if (options.id) {
      this.setData({
        goodsid: this.options.id,
        goods_name: this.options.title,
        good_img: this.options.img,
        approot: ""
      });
      wx.request({
        url: getApp().globalData.api + "&r=goods.remarkon.getComment",
        data: {
          goods_id: this.data.goodsid
        },
        success(res) {
          that.setData({
            list1: res.data.list,
            istrue: true
          });
        }
      });
    }
    wx.request({
      url: getApp().globalData.api + "&r=pet.get_list",
      data: {
        openid: values.openid
      },
      success(res) {
        that.setData({
          list: res.data.list,
          pet_id: res.data.list[0].id,
          nationality: res.data.list[0].nationality
        });
      }
    });
  },
  changeData: function() {
    this.setData({
      approot: getApp().globalData.approot
    });
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=goods.remarkon.getGoods",
      data: {
        openid: values.openid
      },
      success(res) {
        console.log(res.data);
        that.setData({
          goodsid: res.data.goodsid,
          goods_name: res.data.title,
          good_img: res.data.thumb
        });
        wx.request({
          url: getApp().globalData.api + "&r=goods.remarkon.getComment",
          data: {
            goods_id: res.data.goodsid
          },
          success(res) {
            that.setData({
              list1: res.data.list,
              istrue: true
            });
          }
        });
      }
    });
  },
  //删除图片
  remove(e) {
    var index = e.currentTarget.dataset.index;
    var img = this.data.img
    img.splice(index,1);
    this.setData({
      img: img
     });
  },
  //删除视频
  removeVideo(){
      this.setData({
        src:""
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

  onshow(e) {
    var values = wx.getStorageSync("sessionkey");
    var that = this;
    var id = e.currentTarget.dataset.id;
    if (this.data.pet_id == id) {
      this.setData({
        show: e.currentTarget.dataset.index,
        pet_id: e.currentTarget.dataset.id,
        nationality: e.currentTarget.dataset.nationality
      });
      return false;
    }
    this.setData({
      show: e.currentTarget.dataset.index,
      pet_id: e.currentTarget.dataset.id,
      nationality: e.currentTarget.dataset.nationality,
      goods_name: "",
      goodsid: "",
      remarkon_start: [],
      list1: [],
      istrue: false,
      message: "",
      img: [],
      src: "",
      money: "",
      zongji: "",
      images: [],
      video: [],
      good_img: ""
    });
  },
  onChange(e) {
    const index = e.currentTarget.dataset.index;
    const pingfenId = e.currentTarget.dataset.id;
    const field = `list1[${index}].value`;
    const id = `list1[${index}].id`;
    const value = e.detail;

    this.setData({
      [field]: value,
      [id]: pingfenId
    });

    setTimeout(() => {
      this.zongji();
    }, 300);
  },

  money(e) {
    
    let value = e.detail
    
    this.setData({
      money: value
    });
  },
  liuyan(e) {
    this.setData({
      message: e.detail.value
    });
  },
  zongji() {
    //总数
    let sum = this.data.list1
      .map(el => el.value)
      .reduce((num, item) => num + item);
    let zongping = (sum / this.data.list1.length) * 2;

    // 判断是否有没选择的

    let value = this.data.list1.filter(el => el.value <= 0);
    if (value.length > 0) {
      // 如果有值小于0的数组，那就是有没选中的
      return;
    } else {
      for (let i = 0; i < this.data.list1.length; i++) {
        this.data.remarkon_start.push({
          remarkon_id: this.data.list1[i].id,
          start: this.data.list1[i].value
        });
      }
      this.setData({
        zongji: Math.round(zongping) / 2,
        remarkon_start: this.data.remarkon_start
      });
    }
  },
  goSelect() {
    var nationality = this.data.nationality;
    wx.navigateTo({
      url: `/pages/release/selectGoods/index?id=${nationality}&&type=1`
    });
  },

  //取消发布
  onClose3() {
    wx.navigateBack({
      delta: 1
    });
  },
 
  //发布
  submit() {
    var that = this;
   
    var values = wx.getStorageSync("sessionkey");
    if (this.data.pet_id == "") {
      wx.showToast({
        title: "请选择宠物卡",
        icon: "none"
      });
      return false;
    }
    if (this.data.goodsid == "") {
      wx.showToast({
        title: "请选择商品",
        icon: "none"
      });
      return false;
    }
    if (this.data.remarkon_start == "") {
      wx.showToast({
        title: "请选择评价",
        icon: "none"
      });
      return false;
      count;
    }
    if (this.data.money == "") {
      wx.showToast({
        title: "请填写商品价格",
        icon: "none"
      });
      return false;
    }
    if (this.data.money == 0) {
      wx.showToast({
        title: "商品价格不得为0",
        icon: "none"
      });
      return false;
    }
    if (this.data.money == NaN) {
      wx.showToast({
        title: "商品价格必须是数字",
        icon: "none"
      });
      return false;
    }
    if (this.data.message == "") {
      wx.showToast({
        title: "请输入留言",
        icon: "none"
      });
      return false;
    }
    if(this.data.load){
      this.setData({
        load:false
      })
    }else{
      return false
    }
    var remarkon_start = JSON.stringify(that.data.remarkon_start);
    var img = JSON.stringify(that.data.img);
    var video = JSON.stringify(that.data.video);
    wx.request({
      url: getApp().globalData.api + "&r=goods.remarkon.addGoodsRemarks",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pet_id: that.data.pet_id,
        openid: values.openid,
        good_id: that.data.goodsid,
        remarkon_start: remarkon_start,
        remark: that.data.message,
        images: img,
        price:
          Math.abs(parseFloat(that.data.money)) < 0.01
            ? 0.01
            : Math.abs(parseFloat(that.data.money).toFixed(2)),
        videos: video
      },
      success(res) {
        if (res.data.error == 0) {
          wx.showToast({
            title: "点评成功"
          });
          wx.request({
            url:
              getApp().globalData.api +
              "&r=commission.poster.getimage&id=33&comefrom=wxapp&",
            data: {
              openid: values.openid,
              id: 33
            },
            success(res) {
              console.log()
              wx.navigateTo({
                url:`/pages/id/haibao/index?link=${res.data.poster}`
              })
            
            }
          });
        
          return false;
        }
      
        wx.showToast({
          title: res.data.message,
          icon: "none"
        });
        that.setData({
          load:true
        })
      }
    });
  }
});
