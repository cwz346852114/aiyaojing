// pages/release/photo/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        length: 0,
        list: [],
        value: "",
        img: [],
        imgs: [],
        post:"",
        load:true
    },
    length(e) {
        let length = e.detail.value.length;
        this.setData({
            length: length,
            value: e.detail.value
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
    
    unload() {
        var that = this;

        wx.chooseImage({
            success(res) {
                const pic = res.tempFilePaths;
                for(let i=0;i<pic.length;i++){
                    wx.uploadFile({
                        url:
                            getApp().globalData.api +
                            "&r=util.uploader.upload2&file=file",
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
    close() {
        wx.navigateBack({
            delta: 1
        });
    },
    submit() {
        var values = wx.getStorageSync("sessionkey");
        var that = this;
        console.log(this.data.img)
        console.log(this.data.value)
        if(this.data.img.length==0){
            wx.showToast({
                title:"请发布写真图片",
                icon:"none"
            })
            return false
        }
        var img = JSON.stringify(that.data.img);
        if(this.data.value==""){
            wx.showToast({
                title:"请填写评价",
                icon:"none"
            })
            return false
        }
        if(this.data.value.length<4){
            wx.showToast({
                title:"评价必须超过4个字",
                icon:"none"
            })
            return false
        }
        if(this.data.load){
            this.setData({
              load:false
            })
          }else{
            return false
          }
        wx.request({
            url:
                getApp().globalData.api +
                "&r=goods.remarkon.addGoodsPhotoAlbum",
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                openid: values.openid,
                pet_id: that.data.list.id,
                content: that.data.value,
                images: img
            },
            success() {
                setTimeout(()=>{
                    wx.showToast({
                        title: "发布成功"
                    });
                },2000)
                that.setData({
                    load:true
                })
                wx.reLaunch({
                    url: "/pages/id/list/index"
                });
            }
        });
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
            url: getApp().globalData.api + "&r=goods.remarkon.toPhotoAlbum",
            data: {
                openid: values.openid
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

 
});
