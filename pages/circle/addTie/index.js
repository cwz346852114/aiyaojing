Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    post: "",
    post1: "",
    value: "",
    show: false,
    img: [],
    imgs: [],
    src: "",
    video: [],
    video1: [],
    load:true,
    circle:""
  },
  onChange(e) {
    console.log(e)
    this.setData({
      value: e.detail.value
    });
  },
  remove() {
    this.setData({
      show: false,
      good_id:""
    });
  },
 //删除视频
 removeVideo(){
  this.setData({
    src:""
  })
},
  uploadImg() {
    var that = this;
    wx.chooseImage({
      success(res) {
        const pic = res.tempFilePaths;
        for(let i=0;i<pic.length;i++){
          wx.uploadFile({
            url: getApp().globalData.api + "&r=util.uploader.upload2&file=file",
            filePath: pic[i],
            name: "file",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
              var img = JSON.parse(res.data);
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

  submit() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    if (!this.data.show) {
      this.setData({
        "list.id": ""
      });
    }
    if (this.data.value == "") {
      wx.showToast({
        title: "帖子内容不得为空",
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
    var img = JSON.stringify(that.data.img);
    var video = JSON.stringify(that.data.video);
    wx.request({
      url: getApp().globalData.api + "&r=sns.post.submitPost",
      data: {
        openid: values.openid,
        bid:that.data.circle.id?that.data.circle.id:that.options.id,
        content: that.data.value,
        images: img,
        videos: video,
        good_id: this.data.list.goodsid
      },
      success(res) {
        that.setData({
          load:true
        })
        console.log(res)
        if (res.data.error == 0) {
          wx.navigateBack({
            delta: 1
          });
          return false;
        }
        wx.showToast({
          title: res.data.message,
          icon: "none"
        });
      }
    });
  },
    //删除图片
    remove1(e) {
      var index = e.currentTarget.dataset.index;
      var img = this.data.img
      img.splice(index,1);
      this.setData({
        img: img
       });
    },
  changeData: function() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
    wx.request({
      url: getApp().globalData.api + "&r=goods.remarkon.getGoods",
      data: {
        openid: values.openid
      },
      success(res) {
        console.log(res);
        var list = res.data;
        if (list.thumb.indexOf("http") != -1) {
          that.setData({
            post: ""
          });
        }

        that.setData({
          list: list,
          show: true
        });
      }
    });
  },
  changeData1: function() {
    var that = this;
    var values = wx.getStorageSync("sessionkey");
   var circle =  wx.getStorageSync('circle')
        console.log(circle)
    this.setData({
      circle:circle
    })
  },
  goSelect1() {
    wx.navigateTo({
      url: `/pages/release/selectGoods/index?type=2`
    });
  },
  goSelect() {
    wx.navigateTo({
      url: `/pages/release/selectGoods/index?type=1`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      post: getApp().globalData.approot,
      post1: getApp().globalData.approot
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

});
