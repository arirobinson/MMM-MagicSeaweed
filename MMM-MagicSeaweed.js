Module.register("MMM-MagicSeaweed",{
    // Default module config.
	defaults: {
        apiKey: "abc123",
        spotId: 6144,
        updateInterval: 10 * 60 * 1000,
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
            let colours = [];
            let heights = [];

            for (hour of result){
                //console.log(hour.timestamp + ", " + new Date(hour.timestamp * 1000))
                timestamp.push(new Date(hour.timestamp * 1000)); 

                let height = (hour.swell.absMaxBreakingHeight + hour.swell.absMinBreakingHeight) / 2;
                heights.push(height);


                let colour = '';
                let opacity = 0.5;

                switch (hour.solidRating){
                    case 1:
                        colour = 'rgba(255, 0, 0, ' + opacity + ')';
                        break;
                    case 2:
                            colour = 'rgba(255, 127, 0, ' + opacity + ')';
                            break;
                    case 3:
                            colour = 'rgba(255, 255, 0, ' + opacity + ')';
                            break;
                    case 4:
                            colour = 'rgba(127, 255, 0, ' + opacity + ')';
                            break;
                    case 5:
                            colour = 'rgba(0, 255, 0, ' + opacity + ')';
                            break;
                }

                colours.push(colour);
            }


            let chartConfig = {
                type: 'bar',
                data: {
                    datasets: [
                        {
                            label: 'Solid Star',
                            yAxisID: 'Left',
                            data: heights,
                            backgroundColor:  colours,//'rgba(54, 162, 235, 0.4)',
                        },
                    ],
                    labels: timestamp,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
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
                        }],
                        yAxes: [
                            {
                                id: 'Left',
                                position: 'left',
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

        setInterval(function() {
            self.getUpdate();
        }, this.config.updateInterval);
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