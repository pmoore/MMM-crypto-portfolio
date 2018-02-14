var NodeHelper = require('node_helper')
var request = require('request')

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM Crypto portfolio module loaded!')
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'READ_COINS') {
      this.getTickers(payload)
    } else if (notification === 'READ_MARKET_CAP'){
      this.getCaps(payload)  
    }
  },

  getTickers: function (url) {
    var self = this
    request({url: url, method: 'GET'}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         //console.log('COINS_DATA') 
         self.sendSocketNotification('COINS_DATA', JSON.parse(body))
      }
    })
  },
  getCaps: function (url) {
    var self = this
    request({url: url, method: 'GET'}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         //console.log('MARKET_CAP_DATA') 
         self.sendSocketNotification('MARKET_CAP_DATA', JSON.parse(body))
      }
    })
  }

})