/*global $ navigator APIKEY GOOGLEKEY */
$(document).ready(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
    function showPosition(position) {
        console.log(position);
        weatherAPI.latitude = position.coords.latitude;
        weatherAPI.longitude = position.coords.longitude;
        weatherAPI.weatherInfo();
        weatherAPI.reverseGeo();
    }
});

var weatherAPI = {
    latitude: "",
    longitude: "",
    weatherType: "",
    icon: "",
    temp: "",
    maxTemp: "",
    minTemp: "",
    weatherInfo: function() {
        $.ajax({
            method: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather",
            data: { lat: weatherAPI.latitude, lon: weatherAPI.longitude, units: "imperial", appid: APIKEY},
            dataType: "json",
            success: function(weather) {
                console.log(weather);
                weatherAPI.weatherType = weather.weather[0].main;
                weatherAPI.icon = weather.weather[0].icon;
                weatherAPI.temp = weather.main.temp;
                weatherAPI.maxTemp = weather.main.temp_max;
                weatherAPI.minTemp = weather.main.temp_min;
                document.getElementById("currentTemp").innerHTML = weatherAPI.temp;
                document.getElementById("minT").innerHTML = weatherAPI.minTemp;
                document.getElementById("maxT").innerHTML = weatherAPI.maxTemp;
                document.getElementById("weatherType").innerHTML = weatherAPI.weatherType;
                document.getElementById("weatherImg").innerHTML = '<img src=' + '"http://openweathermap.org/img/w/' +weatherAPI.icon+ '.png">';
            }
        });
    },
    city: "",
    state: "",
    reverseGeo: function() {
        $.ajax({
            method: "GET",
            url: "https://maps.googleapis.com/maps/api/geocode/json",
            data: { latlng: weatherAPI.latitude + "," + weatherAPI.longitude, key: GOOGLEKEY},
            dataType: "json",
            success: function(cityinfo) {
                console.log(cityinfo);
                var local = cityinfo.results[0];
                weatherAPI.city = local.address_components[3].long_name;
                weatherAPI.state = local.address_components[5].short_name;
                document.getElementById("cityState").innerHTML = weatherAPI.city + ", " + weatherAPI.state;
            }
        });
    },
};

document.getElementById("togBtn").onchange = function() {
    var checkbox = document.getElementById("togBtn");
    if(checkbox.checked){
        document.getElementById("currentTemp").innerHTML = (weatherAPI.temp - 32) * 5 / 9;
        document.getElementById("maxT").innerHTML = (weatherAPI.maxTemp - 32) * 5 / 9;
        document.getElementById("minT").innerHTML = (weatherAPI.minTemp - 32) * 5 / 9;
    }
    else {
        document.getElementById("currentTemp").innerHTML =  weatherAPI.temp;
        document.getElementById("maxT").innerHTML =  weatherAPI.maxTemp;
        document.getElementById("minT").innerHTML =  weatherAPI.minTemp;
    }
};