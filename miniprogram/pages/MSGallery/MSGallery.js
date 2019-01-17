// pages/gallery.js
const db = wx.cloud.database()
const imageBatchCount = 5
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadedImages: [],
    availableImages: [],
    loadingImages: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadAvailableImageList()
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          imageWidth: res.pixelRatio * res.windowWidth,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.loadingImages > 0) {
      return
    }
    this.loadMoreImages()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  downloadFile: function(fileID) {
    let that = this
    console.log("downloading: " + fileID)
    that.setData({
      loadingImages: this.data.loadingImages + 1
    })
    wx.cloud.downloadFile({
      fileID: appInstance.globalData.displayPictureCloudUrlPrefix + fileID, // 文件 ID
      success: res => {
        console.log(res.tempFilePath)
        let downloadedImages = that.data.downloadedImages
        console.log("downloaded: " + fileID + "location: " + res.tempFilePath)
        downloadedImages.push(res.tempFilePath)
        that.setData({
          downloadedImages: downloadedImages,
          loadingImages: that.data.loadingImages - 1
        })
      },
      fail: error => {
        console.log(error)
        that.setData({
          downloadedImages: downloadedImages,
          loadingImages: that.data.loadingImages - 1
        })
      }
    })
  },
  loadAvailableImageList() {
    var that = this
    wx.cloud.callFunction({
      name: 'getFileIDListFromCollection',
      data: {
        collection: 'galleryImageIDMap'
      },
      success: function(res) {
        console.log("loaded " + res.result.data.length + " available Image: " + res)
        that.setData({
          availableImages: res.result.data
        })
        that.loadMoreImages()
      },
      fail: function(res) {
        wx.showToast({
          title: '调用失败',
        })
        console.log(res)
      }
    })
  },
  loadMoreImages: function() {
    var numOfImageToLoad = Math.min(this.data.availableImages.length - this.data.downloadedImages.length, imageBatchCount)
    console.log(numOfImageToLoad + " images to load")
    var s = this.data.downloadedImages.length
    for (var i = 0; i < numOfImageToLoad; i++) {
      this.downloadFile(this.data.availableImages[s + i].imageId)
    }
  },
  findApartment: function() {
    wx.navigateTo({
      url: '../MSApartmentFinder/MSApartmentFinder'
    })
  }
})