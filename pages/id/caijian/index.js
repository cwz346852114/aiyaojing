import WeCropper from "../../../we-cropper/we-cropper.js";

const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;

Page({
  data: {
    cropperOpt: {
      id: "cropper",
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      },
     
    },
    src:[],
    src1:[]
  },
  touchStart(e) {
    this.wecropper.touchStart(e);
  },
  touchMove(e) {
    this.wecropper.touchMove(e);
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e);
  },
  //这个是保存上传裁剪后的图片的方法
  getCropperImage() {
    var that = this;
    this.wecropper.getCropperImage(avatar => {
      console.log(avatar)
      if (avatar) {
        uploadImage(avatar, function(res) {});
        function uploadImage(filePath, cb) {
          //个人封装的简单的上传单张图片上传的方法
     
          wx.uploadFile({
            url: getApp().globalData.api + "&r=util.uploader.upload2&file=file",
            filePath: that.data.src[0],
            name: "file",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success(res) {
              var img = JSON.parse(res.data);
              console.log(img)
         
              // 获取到裁剪后的图片 
                wx.navigateTo({
                  url: `/pages/id/headPortrait/index?src=${avatar}` //如果需要这图片地址就传过去 ，因为我上传后跳转页面后会自己获取服务器的是地址了。这里仅提供思路参考。
                });
         
           
              wx.showToast({
                title: "上传成功"
              });
        
            },
            fail: function(res) {
            
              wx.showToast({
                title: "上传失败"
              });
            }
          });
        }
      } else {
        console.log("获取图片失败，请稍后重试");
      }
    });
  },
  uploadTap() {
    const self = this;
    
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0];
        // 获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src);
      }
    });
  },
  onLoad(option) {
    console.log(option.src)
    console.log(this.data.src)
    this.data.src1.push(option.src)
    this.setData({
      src:this.data.src1
    })
    const { cropperOpt } = this.data;

    if (option.src) {
      cropperOpt.src = option.src;
      new WeCropper(cropperOpt)
        .on("ready", ctx => {
          console.log(`wecropper is ready for work!`);
        })
        .on("beforeImageLoad", ctx => {
          console.log(`before picture loaded, i can do something`);
          console.log(`current canvas context:`, ctx);
          wx.showToast({
            title: "上传中",
            icon: "loading",
            duration: 20000
          });
        })
        .on("imageLoad", ctx => {
          console.log(`picture loaded`);
          console.log(`current canvas context:`, ctx);
          wx.hideToast();
        })
        .on("beforeDraw", (ctx, instance) => {
          console.log(`before canvas draw,i can do something`);
          console.log(`current canvas context:`, ctx);
        })
        .updateCanvas();
    }
  }
});
