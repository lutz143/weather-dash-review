

var searchBtn = document.getElementById("searchBtn");
var forecastEl = document.getElementById("forecasts");

var historyArray = loadHistory();

function convertSearch() {
    var input = document.getElementById("input").value.trim();

    fetch("https://api.openweathermap.org/geo/2.5/direct?q=" + input + "&limit=1&appid=4c68348ebef06f62bb4687ae1b234b42")
    .then((response) => response.json())
    .then(function(data) {
        var lon = data[0].lon;
        var lat = data[0].lat;
        var city = data[0].name;
        getWeatherData(lon, lat, city);
        saveHistory(city);
        updateHistory();
        document.getElementById("input").value = "";
    })
};

function convertHistorySearch(historyBtnInfo) {
    var input = historyBtnInfo.textContent;

    fetch("http://api.openweathermap.org/data/3.0/forecast?id=524901&appid=4c68348ebef06f62bb4687ae1b234b42")
    .then((response) => response.json())
    .then(function (data) {
        var lon = data[0].lon;
        var lat = data[0].lat;
        var city = data[0].name;
        getWeatherData(lon, lat, city);
    })
};

function getWeatherData(lon, lat, city) {
    fetch("https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely&units=imperial&appid=3235f6ca43f152b21beee3053909231f")
        .then((response) => response.json())
        .then(function (data) {
            console.log(data);
            currentDay(data, city);
            fiveDay(data);
        })
}

//Current Weather
function currentDay(data, city) {
    var date = new Date((data.current.dt * 1000) - (data.timezone_offset * 1000))
    var icon = data.current.weather[0].icon;

    var currentyCityEl = document.getElementById("currentCity");
    var currentDateEl = document.getElementById("currentDate");
    var currentIconEl = document.getElementById("currentIcon");
    var currentTempEl = document.getElementById("currentTemp");
    var currentHumidityEl = document.getElementById("currentHumidity");
    var currentWindEl = document.getElementById("currentWind");

    currentyCityEl.textContent = city;
    currentDateEl.textContent = date.toLocaleDateString("en-US");
    currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
    currentTempEl.textContent = data.current.temp;
    currentHumidityEl.textContent = data.current.humidity;
    currentWindEl.textContent = data.current.wind_speed;
}

//Forecast week out
function weekOut(data) {

    for (var i = 1; i < 6; i++) {
        var date = new Date((data.daily[i].dt * 1000) - (data.timezone_offset * 1000));
        var icon = data.daily[i].weather[0].icon;

        var dateEl = document.getElementById("date" + i);
        var iconEl = document.getElementById("icon" + i);
        var tempEl = document.getElementById("temp" + i);
        var humidityEl = document.getElementById("humidity" + i);
        var windEl = document.getElementById("wind" + i);

        dateEl.textContent = date.toLocaleDateString("en-US");
        iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
        tempEl.textContent = "Temp: " + data.daily[i].temp.day + "°F";
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
        windEl.textContent = "Wind Spd: " + data.daily[i].wind_speed + "mph";

        forecastsEl.classList.remove("hidden");
    }
}

//Saved History
function saveHistory(city) {

    if (!historyArray) {
        historyArray = [city];
    } else {
        historyArray.unshift(city);
    };
    if (historyArray.length > 5) {
        var delExtra = historyArray.pop();
    }

    localStorage.setItem("history", JSON.stringify(historyArray));
}

// Load 
function loadHistory() {
    var historyArray = JSON.parse(localStorage.getItem("history"));

    return historyArray;
}

//Updated 
function updateHistory() {
    if (historyArray != null) {
        for (var i = 0; i < historyArray.length; i++) {
            var historyBtn = document.getElementById("btn" + i);

            historyBtn.textContent = historyArray[i];

            historyBtn.addEventListener("click", function() {convertHistorySearch(event.target)});
        }
    }
}

// Buttons
searchBtn.addEventListener("click", convertSearch);
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});

// load all and update functions 
loadHistory();
updateHistory();