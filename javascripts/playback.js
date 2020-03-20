var fps = 60;
var interval = 1000 / fps;
var numSteps = 30; //Change this to set animation resolution

var dateStep = 24*60*60*1000; // 24 hours
var stepTime = 0; // milliseconds
window.done = false;

var initDate = new Date('2020/01/22');


var startDate = new Date('2020/01/22');
var endDate = new Date();

var gooddate = false;

var covidConf = [];
var covidRec = [];
var covidDeath = [];

var map = null;

var j = -1;

function updateSlider(start,end){
    $('#slider-range').slider('values', [start, end]).change();
}

function initializeSlider(min, max, start, end){
    $( "#slider-range" ).slider({
        range: true,
        min:min.getTime() / 1000,
        max: max.getTime() / 1000,
        step: 86400,
        values: [ start.getTime() / 1000 ,end.getTime() / 1000 ],
        slide: function( event, ui ) {
            
            startDate = new Date($( "#slider-range" ).slider( "values", 0 )*1000);
            endDate = new Date($( "#slider-range" ).slider( "values", 1 )*1000);
            dateSlice = new Date($( "#slider-range" ).slider( "values", 0 )*1000);
            pause();
            playMap();
            plotCountryChart();
            
            // $( "#amount" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
        }
      });
}


// For Obscuring Details
Number.prototype.round = function(p) {
    p = p || 10;
    return parseFloat(this.toFixed(p));
};

function mapControls([map]){
    function zoomAsia() {
        let calgaryPosition = new google.maps.LatLng(49, 90);
        fps = 60;
        interval = 1000 / fps;
        numSteps = 180; //Change this to set animation resolution

        map.setZoom(4);
        map.panTo(calgaryPosition);
    }

    function zoomAus() {
        let calgaryPosition = new google.maps.LatLng(-30, 130);
        fps = 60;
        interval = 1000 / fps;
        numSteps = 180; //Change this to set animation resolution

        map.setZoom(4);
        map.panTo(calgaryPosition);
    }

    function zoomEU() {
        let calgaryPosition = new google.maps.LatLng(60, -0);
        fps = 60;
        interval = 1000 / fps;
        numSteps = 120; //Change this to set animation resolution

        map.setZoom(4);
        map.panTo(calgaryPosition);
    }

    function zoomAF() {
        let calgaryPosition = new google.maps.LatLng(10, 15);
        fps = 60;
        interval = 1000 / fps;
        numSteps = 120; //Change this to set animation resolution

        map.setZoom(4);
        map.panTo(calgaryPosition);
    }

    function zoomNA() {
        let calgaryPosition = new google.maps.LatLng(44.1, -79);
        fps = 60;
        interval = 1000 / fps;
        numSteps = 120; //Change this to set animation resolution

        map.setZoom(4);
        map.panTo(calgaryPosition);            
    }

    function zoomSA() {
        let calgaryPosition = new google.maps.LatLng(-10, -79);
        fps = 60;
        interval = 1000 / fps;
        numSteps = 120; //Change this to set animation resolution

        map.setZoom(4);
        map.panTo(calgaryPosition);            
    }

    $('.zoomAF').on('click', zoomAF);
    $('.zoomSA').on('click', zoomSA);
    $('.zoomNA').on('click', zoomNA);
    $('.zoomEU').on('click', zoomEU);
    $('.zoomAsia').on('click', zoomAsia);
    $('.zoomAus').on('click', zoomAus);
}

function pause(){
    $("#pause").hide();
    $("#resume").show();
    window.done = true;
}

function resume(){
    $("#pause").show();
    $("#resume").hide();
    window.done = false;
    playMap();
}

async function playback(){
    dateSlice = startDate;
    window.done = false;
    $("#pause").show();
    $("#resume").hide();
    initializeSlider(initDate, new Date(), startDate, endDate);
    await initTSMap();
}

async function reset(){
    dateSlice = new Date('2020/01/22');
    window.done = false;
    $("#pause").hide();
    $("#resume").hide();
    initializeSlider(initDate, new Date(), initDate, new Date());
    await resetTSMap().then(mapControls);
}

// Initialize Map
async function resetTSMap() {
    return new Promise((resolve, reject) => {
        let pos = new google.maps.LatLng(51, -114);
        let promiseList = [fetchCovid()];
        Promise.all(promiseList)
            .then((data) => {
                // Data Sets
                var confirmedTotal = 0;
                var deathTotal = 0;
                var recoveredTotal = 0;
                var deathRecCnt = "N/A";
                var deathConfCnt = "N/A";
                var deathRecDCnt = "N/A";
                // Update Online Counts
                $('#confCnt').html(confirmedTotal);
                $('#deathCnt').html(deathTotal);
                $('#recCnt').html(recoveredTotal);
                $('#deathRecCnt').html(deathRecCnt);
                $('#deathConfCnt').html(deathConfCnt);
                $('#deathRecDCnt').html(deathRecDCnt);
                

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

                resolve([map]);
            });
    });
}

// Initialize Map
async function initTSMap() {
    return new Promise((resolve, reject) => {
        let pos = new google.maps.LatLng(51, -114);
        let promiseList = [fetchConfirmedTS(), fetchDeathTS(), fetchRecoveredTS()];
        Promise.all(promiseList)
            .then(async (data) => {
                // Data Sets
                covidConf = data[0];
                covidDeath = data[1];
                covidRec = data[2];
                                     
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

                mapControls([map]);

                initializeSlider(initDate, new Date(),startDate, endDate);

                await playMap();
                
                resolve([map]);
            });
    });
} 

async function playMap(){
    // Add Businesses to Map + VGs
    while (!window.done && dateSlice.getTime() <= endDate.getTime()) {
        let regions = covidConf.length
        j = -1;

        var confirmedTotal = covidConf.map((x)=>parseInt(x[getDate(dateSlice)])).reduce((sum,x)=>(sum + x));
        var deathTotal = covidDeath.map((x)=>parseInt(x[getDate(dateSlice)])).reduce((sum,x)=>(sum + x));
        var recoveredTotal = covidRec.map((x)=>parseInt(x[getDate(dateSlice)])).reduce((sum,x)=>(sum + x));
        var deathRecCnt = deathTotal/recoveredTotal;
        var deathConfCnt = deathTotal/confirmedTotal;
        var deathRecDCnt = deathTotal/(recoveredTotal + deathTotal);
        
        // Update Online Counts
        $('#confCnt').html(confirmedTotal);
        $('#deathCnt').html(deathTotal);
        $('#recCnt').html(recoveredTotal);
        $('#deathRecCnt').html(deathRecCnt.toFixed(2));
        $('#deathConfCnt').html(deathConfCnt.toFixed(2));
        $('#deathRecDCnt').html(deathRecDCnt.toFixed(2));
        $('#dateTime').html(getDate(dateSlice));
       
        while (++j < regions) {                        
            if(window.done)
                await dropMarker(covidConf, covidDeath, covidRec, j, dateSlice, stepTime)
            else
                window.done = await dropMarker(covidConf, covidDeath, covidRec, j, dateSlice, stepTime)
        }
        if(!window.done){
            dateSlice = new Date(dateSlice.getTime() + dateStep);
            updateSlider(dateSlice, endDate);
            DeleteMarkers();
        }
    }                
}

async function dropMarker(confData, deathData, recData, j, date, delay){
    // Businesses
    let region = confData[j];
    let regLat = parseFloat(region.Lat);
    let regLng = parseFloat(region.Long);
    let users = [];
    let deaths = deathData[j][getDate(date)] ? deathData[j][getDate(date)] : 0 ;
    let confirmed = confData[j][getDate(date)] ? confData[j][getDate(date)] : 0 ;
    let recovered = recData[j][getDate(date)] ? recData[j][getDate(date)] : 0 ;

    if(deaths != 0){
        console.log(getDate(date), region["Country/Region"]);
    }
    if(deaths || confirmed || recovered)
        gooddate = true;

    let regPos = new google.maps.LatLng(regLat, regLng);
    var regData = {
        pos: regPos,
        name: (region["Country/Region"] != "" ? region["Country/Region"] : ""),
        type: "Deaths: " + deaths + " - " + "Confirmed: " + confirmed
    };

    let country =  (region["Country/Region"] != "" ? region["Country/Region"] : "");
    let prov =  (region["Province/State"] != "" ? region["Province/State"] : "");
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

    if(delay >= 0){
        await sleep(delay);
    }

    if(window.done || (gooddate && (typeof deaths == "undefined" || typeof confirmed == "undefined" || typeof recovered == "undefined")))
        return true
    else
        return false;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Fetch VG Group
async function fetchDeathTS() {
    return new Promise((resolve, reject) => {
        // Load Users
        $.ajax({
            url: '/data/covid-deaths-ts.json',
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


// Fetch VG Group
async function fetchRecoveredTS() {
    return new Promise((resolve, reject) => {
        // Load Users
        $.ajax({
            url: '/data/covid-recovered-ts.json',
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


// Fetch VG Group
async function fetchConfirmedTS() {
    return new Promise((resolve, reject) => {
        // Load Users
        try{
        $.ajax({
            url: '/data/covid-confirmed-ts.json',
            method: 'GET',
            success: function(data) {
                if (typeof data === "string") {
                    resolve(JSON.parse(data))
                } else {
                    resolve(data);
                }
            }
        });
    }catch(e){
        reject(e);
    }
    });
}
