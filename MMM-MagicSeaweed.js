Module.register("MMM-MagicSeaweed",{
    // Default module config.
	defaults: {
        apiKey: "abc123",
        spotId: 6144,
        updateInterval: 60 * 1000,
        width: 500,
        height: 300,
	},

	// Override dom generator.
	getDom: function(value) {
        var wrapper = document.createElement("div");
        wrapper.setAttribute("style", "position: relative; display: inline-block;");
        wrapper.style.width = this.config.width + "px";
  	    wrapper.style.height = this.config.height + "px";

        if (result != ""){
            let chart1 = document.createElement("canvas");

            let timestamp = [];
            let fadedRating = [];
            let solidRating = [];
            let minBreakingHeight = [];
            let maxBreakingHeight = [];

            for (hour of result){
                //console.log(hour.timestamp + ", " + new Date(hour.timestamp * 1000))
                timestamp.push(new Date(hour.timestamp * 1000)); 
                fadedRating.push(hour.fadedRating);
                solidRating.push(hour.solidRating);
                minBreakingHeight.push(hour.swell.absMinBreakingHeight);
                maxBreakingHeight.push(hour.swell.absMaxBreakingHeight);
            }


            let chartConfig = {
                type: 'bar',
                data: {
                    datasets: [
                        {
                            label: 'Min Height',
                            yAxisID: 'Right',
                            data: minBreakingHeight,
                            borderColor: 'rgba(255, 0, 0, 0.5)',
                            type: 'line',
                            pointRadius: 0
                        },
                        {
                            label: 'Max Height',
                            yAxisID: 'Right',
                            data: maxBreakingHeight,
                            borderColor: 'rgba(255, 0, 0, 0.5)',
                            type: 'line',
                            pointRadius: 0
                        },

                        {
                            label: 'Solid Star',
                            yAxisID: 'Left',
                            data: solidRating,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        },
                        {
                            label: 'Faded Star',
                            yAxisID: 'Left',
                            data: fadedRating,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        },
                    ],
                    labels: timestamp,
                },
                options: {
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                displayFormats: {
                                    hour: 'ddd hA'
                                },
                                unit: 'hour',
                                stepSize: 3,
                            },
                            stacked: true
                        }],
                        yAxes: [
                            {
                                id: 'Left',
                                position: 'left',
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                    suggestedMax: 5,
                                    suggestedMin: 0,
                                    callback: function(value, index, values) {
                                        return value + " ★";
                                    }
                                },
                            },
                            {
                                id: 'Right',
                                position: 'right',
                                stacked: false,
                                ticks: {
                                    beginAtZero: true,
                                    suggestedMax: 10,
                                    suggestedMin: 0,
                                    callback: function(value, index, values) {
                                        return value + " ft";
                                    }
                                },
                            }]
                    }
                }
            };
            
            this.chart = new Chart(chart1.getContext("2d"), chartConfig);

            wrapper.appendChild(chart1);
        }

		return wrapper;
    },
    
    start: function() {
        var self = this;

        result = "";

        self.getUpdate();

        /*setInterval(function() {
            self.getUpdate();
        }, this.config.updateInterval);*/
    },

    getUpdate: function(arr){
        var url = "http://magicseaweed.com/api/" + this.config.apiKey + "/forecast/?spot_id=" + this.config.spotId;

        //url = "/modules/MMM-MagicSeaweed/public/sample-1.json"

        this.sendSocketNotification('URL-Request', url);
        
        /*result = await fetch(url)
            .then(res => res.json())
            .then(json => {
                return json;
            });
        this.updateDom();*/
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'URL-Response') {
            result = payload;

            //console.log(result);

            this.updateDom(2000);
        }
      },

    getStyles: function() {
        return [
            this.file('custom.css'), // this file will be loaded straight from the module folder.
        ]
    },

    getScripts: function() {
		return ["modules/" + this.name + "/public/chart.js/Chart.bundle.min.js"];
    },

    dataPoint: function() {
        this.localTimestamp = 0;
        this.fadedRating = 0;
        this.solidRating = 0;
        this.minBreakingHeight = 0;
        this.maxBreakingHeight = 0;
    },
});