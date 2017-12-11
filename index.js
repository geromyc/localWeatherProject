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
    description: "",
    id: "",
    humidity: "",
    temp: "",
    maxTemp: "",
    minTemp: "",
    windSpd: "",
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
                weatherAPI.description = weather.weather[0].description;
                weatherAPI.id = weather.weather[0].id;
                weatherAPI.temp = weather.main.temp;
                weatherAPI.maxTemp = weather.main.temp_max;
                weatherAPI.minTemp = weather.main.temp_min;
                weatherAPI.humidity = weather.main.humidity;
                weatherAPI.windSpd = weather.wind.speed;
                document.getElementById("currentTemp").innerHTML = parseFloat(weatherAPI.temp).toFixed(0) + "º";
                document.getElementById("minT").innerHTML = parseFloat(weatherAPI.minTemp).toFixed(0) + "º";
                document.getElementById("maxT").innerHTML = parseFloat(weatherAPI.maxTemp).toFixed(0) + "º";
                document.getElementById("weatherType").innerHTML = weatherAPI.weatherType;
                document.getElementById("humid").innerHTML = weatherAPI.humidity + "%";
                document.getElementById("wind").innerHTML = weatherAPI.windSpd + " mph";
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
    
    citySearch: function() {
        var cityName = document.getElementById("search").value;
        console.log(cityName);
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json",
            data: { address: cityName, key: GOOGLEKEY },
            success: function(data) {
                weatherAPI.latitude = data.results[0].geometry.location.lat;
                weatherAPI.longitude = data.results[0].geometry.location.lng;
                weatherAPI.weatherInfo();
                document.getElementById("cityState").innerHTML = cityName;
            }

        });
    }
};

document.getElementById("togBtn").onchange = function() {
    var checkbox = document.getElementById("togBtn");
    if(checkbox.checked){
        document.getElementById("currentTemp").innerHTML = parseFloat((weatherAPI.temp - 32) * 5 / 9).toFixed(0) + "º";
        document.getElementById("maxT").innerHTML = parseFloat((weatherAPI.maxTemp - 32) * 5 / 9).toFixed(0) + "º";
        document.getElementById("minT").innerHTML = parseFloat((weatherAPI.minTemp - 32) * 5 / 9).toFixed(0) + "º";
    }
    else {
        document.getElementById("currentTemp").innerHTML =  parseFloat(weatherAPI.temp).toFixed(0) + "º";
        document.getElementById("maxT").innerHTML =  parseFloat(weatherAPI.maxTemp).toFixed(0) + "º";
        document.getElementById("minT").innerHTML =  parseFloat(weatherAPI.minTemp).toFixed(0) + "º";
    }
};

document.getElementById("submit").onclick = function(event) {
    event.preventDefault();
    weatherAPI.citySearch();
    document.getElementById("search").value = "";
};