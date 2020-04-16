const approot = getApp().globalData.approot
Page({
    /**
     * 页面的初始数据
     */
    data: {
        img1: "/image/cricle/di_tianjia.png",
        img: "",
        title: "",
        guanzhu: "",
        content: "",
        show: false,
        approot:"",
        load:true
    },
    unload() {
        var that = this;
        wx.chooseImage({
            success(res) {
                const pic = res.tempFilePaths;
                wx.uploadFile({
                    url:
                        getApp().globalData.api +
                        "&r=util.uploader.upload2&file=file",
                    filePath: pic[0],
                    name: "file",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },

                    success(res) {
                        var img = JSON.parse(res.data);
                        that.setData({
                            img: img.files[0].filename,
                            show: true
                        });
                    },
                    fail(res) {}
                });
            }
        });
    },
    onChange1(e) {
        this.setData({
            title: e.detail
        });
    },
    onChange2(e) {
        this.setData({
            guanzhu: e.detail
        });
    },
    onChange3(e) {
        this.setData({
            content: e.detail.value
        });
    },
    submit() {
        var that = this;
        var values = wx.getStorageSync("sessionkey");
        if (this.data.img == "") {
            wx.showToast({
                title: "请上传话题logo",
                icon: "none"
            });
            return false;
        }
        if (this.data.title == "") {
            wx.showToast({
                title: "请填写话题名称",
                icon: "none"
            });
            return false;
        }
        if (this.data.guanzhu == "") {
            wx.showToast({
                title: "请填写关注者",
                icon: "none"
            });
            return false;
        }
        if (this.data.content == "") {
            wx.showToast({
                title: "请填写话题描述",
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
        wx.request({
            url: getApp().globalData.api + "&r=sns.post.submitTopic",
            data: {
                logo: that.data.img,
                title: that.data.title,
                follower: that.data.guanzhu,
                desc: that.data.content,
                openid: values.openid
            },
            success(res) {
                that.setData({
                    load:true
                })
                wx.showLoading({
                    title: "加载中"
                });

                setTimeout(function() {
                    wx.hideLoading();
                }, 2000);

                wx.reLaunch({
                    url: "/pages/circle/home/index"
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            approot:approot
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
});
