var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({});

module.exports = NodeHelper.create({
    start: function() {
        console.log(this.name + ' helper started ...');
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;
        request({
            url: payload,
            method: 'GET'
        }, function(error, response, body) {

            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);

                self.sendSocketNotification('URL-Response', data);
            }
        });
    },
  });