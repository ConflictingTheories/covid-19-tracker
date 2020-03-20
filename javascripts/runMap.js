var fps = 60;
var interval = 1000 / fps;
var numSteps = 30; //Change this to set animation resolution

var dateSlice = new Date();
var covidData = [];




function genCountries(){
    let countryList = {};
    covidData.map((x)=>{
        let region = x["Country/Region"];
        if(countryList[region]){
            countryList[region].deaths += x.Deaths;
            countryList[region].confirmed += x.Confirmed;
            countryList[region].recovered += x.Recovered;
        }else{
            countryList[region] = { deaths: x.Deaths,confirmed :x.Confirmed,recovered :x.Recovered }
        }
    });
    return countryList;
}

function plotCountryChart(){
    let countries = genCountries();
    let countryNames = Object.keys(countries);
    let deathsByCountry = [];
    let recoveredByCountry = [];
    let confirmedByCountry = [];

    deathsByCountry = countryNames.map((c)=>countries[c].deaths);
    recoveredByCountry = countryNames.map((c)=>countries[c].recovered);
    confirmedByCountry = countryNames.map((c)=>countries[c].confirmed);

    var RecoveredByCountry = {
    x: countryNames.slice(0,20),
    y: recoveredByCountry,
    name: 'Recovered',
    type: "bar",
    opacity: 0.5,
    marker: {
        color: 'green',
    },
    };

    var ConfirmedByCountry = {
    x: countryNames.slice(0,20),
    y: confirmedByCountry.slice(0,20),
    name: 'Confirmed',
    // xaxis: 'x3',
    // yaxis: 'y3',
    type: "bar",
    opacity: 0.6,
    marker: {
        color: 'orange',
    },
    };

    var DeathsByCountry = {
    x: countryNames.slice(0,20),
    y: deathsByCountry.slice(0,20),
    name: 'Deaths',
    // xaxis: 'x2',
    // yaxis: 'y2',
    type: "bar",
    opacity: 0.6,
    marker: {
        color: 'red',
    },
    };

    var recMax =Math.max(...recoveredByCountry);
    const recSum = recoveredByCountry.reduce((a, b) => a + b, 0);
    const recAvg = (recSum / recoveredByCountry.length) || 0;

    var deathMax = Math.max(...deathsByCountry);
    const deathSum = deathsByCountry.reduce((a, b) => a + b, 0);
    const deathAvg = (deathSum /deathsByCountry.length) || 0;

    var confMax = Math.max(...confirmedByCountry);
    const confSum = confirmedByCountry.reduce((a, b) => a + b, 0);
    const confAvg = (confSum / confirmedByCountry.length) || 0;
    

    var normRec = recoveredByCountry.map(x=>1*(x/recMax));
    var normDeath = deathsByCountry.map(x=>1*(x/deathMax));
    var normConf = confirmedByCountry.map(x=>1*(x/confMax));

    var RecoveredByCountryNORM = {
        x: countryNames.slice(0,20),
        y: normRec.slice(0,20),
        name: 'Recovered (Normalized to 1)',
        xaxis: 'x2',
        yaxis: 'y2',
        type: "bar",
        opacity: 0.5,
        marker: {
            color: 'blue',
        },
        };
    
        var ConfirmedByCountryNORM = {
        x: countryNames.slice(0,20),
        y: normConf.slice(0,20),
        name: 'Confirmed (Normalized to 1)',
        xaxis: 'x2',
        yaxis: 'y2',
        type: "bar",
        opacity: 0.6,
        marker: {
            color: 'orangered',
        },
        };
    
        var DeathsByCountryNORM = {
        x: countryNames.slice(0,20),
        y: normDeath.slice(0,20),
        name: 'Deaths (Normalized to 1)',
        xaxis: 'x2',
        yaxis: 'y2',
        type: "bar",
        opacity: 0.6,
        marker: {
            color: 'darkred',
        },
        };

    var data = [RecoveredByCountry,ConfirmedByCountry,DeathsByCountry,RecoveredByCountryNORM,ConfirmedByCountryNORM,DeathsByCountryNORM];

    var layout = {
        paper_bgcolor:'rgba(0,0,0,0)', 
        plot_bgcolor:"rgba(0,0,0,0)",
        autosize: true,
        // width: 500,
        // height: 500,
        margin: {
            l: 40,
            r: 10,
            b: 90,
            t: 20,
            pad: 4
        },
        grid: {rows: 1, columns: 2, pattern: 'independent'}
    }
    // var layout = {grid: {rows: 1, columns: 3, pattern: 'independent'}, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:"rgba(0,0,0,0)"}
    
    
    Plotly.newPlot('chart', data, layout,{staticPlot: false,displayModeBar: false});
}


// For Obscuring Details
Number.prototype.round = function(p) {
    p = p || 10;
    return parseFloat(this.toFixed(p));
};

function getDate(date){
    var ret = date.getUTCMonth()+1 + '/' + date.getUTCDate() + '/' + date.getYear().toString().slice(-2);
    // var ret = date.getFullYear() + '/'  + ('0' + (date.getMonth()+1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
    return ret;
}

// Initialize Map
function initMap() {
    return new Promise((resolve, reject) => {
        let pos = new google.maps.LatLng(51, -114);
        var map = null;
        let promiseList = [fetchCovid()];
        Promise.all(promiseList)
            .then((data) => {
                // Data Sets
                covidData = data[0];
                var confirmedTotal = covidData.map((x)=>parseInt(x.Confirmed)).reduce((sum,x)=>(sum + x));
                var deathTotal = covidData.map((x)=>parseInt(x.Deaths)).reduce((sum,x)=>(sum + x));
                var recoveredTotal = covidData.map((x)=>parseInt(x.Recovered)).reduce((sum,x)=>(sum + x));
                var deathRecCnt = deathTotal/recoveredTotal;
                var deathConfCnt = deathTotal/confirmedTotal;
                var deathRecDCnt = deathTotal/(recoveredTotal + deathTotal);
                // Update Online Counts
                $('#confCnt').html(confirmedTotal);
                $('#deathCnt').html(deathTotal);
                $('#recCnt').html(recoveredTotal);
                $('#deathRecCnt').html(deathRecCnt.toFixed(3));
                $('#deathConfCnt').html(deathConfCnt.toFixed(3));
                $('#deathRecDCnt').html(deathRecDCnt.toFixed(3));
                $('#dateTime').html(getDate(dateSlice));
                $("#pause").hide();
                $("#resume").hide();
                

                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 6,
                    center: pos,
                    disableDefaultUI: true,
                    styles: [{
                        "stylers": [{
                            "hue": "#00eeff"
                        }, {
                            "invert_lightness": true
                        }]
                    }, {
                        "featureType": "road",
                        "stylers": [{
                            "hue": "#ff6e00"
                        }, {
                            "lightness": -11
                        }, {
                            "gamma": 2
                        }]
                    }, {
                        "featureType": "road.arterial",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    }, {
                        "featureType": "road.highway",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    }, {
                        "featureType": "road.local",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    }, {
                        "featureType": "water",
                        "stylers": [{
                            "hue": "#0099ff"
                        }, {
                            "saturation": 100
                        }, {
                            "lightness": -83
                        }, {
                            "gamma": 1.96
                        }]
                    }]
                });

                // Add Businesses to Map + VGs
                let j = -1;
                let regions = covidData.length
                while (++j < regions) {

                    console.log('anot')
                    // Businesses
                    let region = covidData[j];
                    let users = [];
                    let regLat = region.Latitude;
                    let regLng = region.Longitude;
                    let deaths = region.Deaths;
                    let confirmed = region.Confirmed;
                    let recovered = region.Recovered;
                
                    let regPos = new google.maps.LatLng(regLat, regLng);
                    var regData = {
                        pos: regPos,
                        name: (region["Country/Region"] != "" ? region["Country/Region"] : ""),
                        type: "Deaths: " + deaths + " - " + "Confirmed: " + confirmed
                    };

                    let keys = Object.keys(region);
                    let provKey = "﻿Province/State";

                    for(i of keys){
                        if(i.indexOf('State') > 0)
                            provKey = i;
                    }
                    let country =  (region["Country/Region"] != "" ? region["Country/Region"] : "");
                    let prov =  (region[provKey] != "" ? region[provKey] : "");
                    let name = country && prov ? country + " - " + prov : country != "" ? country : prov;
                    // Users
                    var user = {
                        pos: regPos,
                        lat: regLat,
                        lng: regLng,
                        name: name,
                        deaths: deaths,
                        confirmed: confirmed,
                        options: [1,2,3],
                        skills: "Deaths: " + deaths + " - " + "Confirmed: " + confirmed,
                    };
                    users.push(user);
                    pairMarkers(map, users, regData, true)
                }                
                resolve([map]);
            });
    });
}


// Fetch VG Group
function fetchCovid() {
    return new Promise((resolve, reject) => {
        // Load Users
        $.ajax({
            url: '/data/covid.json',
            method: 'GET',
            success: function(data) {
                if (typeof data === "string") {
                    resolve(JSON.parse(data))
                } else {
                    resolve(data);
                }
            }
        });
    });
}