//app.js
App({
  globalData: {
    appid:'wx16e4f3871b53ad11',
    secret:'07a0b5ffc66b980ac2127573ed7a0002'
  },
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-environment-0baa51',
        traceUser: true
      })
    }
    this.onGetOpenid()
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] openid: ', res.result.openid)
        var app = getApp();
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})