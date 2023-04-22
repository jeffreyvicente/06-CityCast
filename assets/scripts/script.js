

var APIKEY = "8c1158ac1ae5b174648a81890c6e113f";
var city = "Tustin"
var mainTemp;
var mainWind;
var mainHumidity;

var currentDate = dayjs().format('MM-DD-YY');
$(function(){
    console.log(currentDate);

    /*
    var APICALL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY;

    console.log("This is the APICALL link: " + APICALL)

    var locationAPICall = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKEY;

    console.log(locationAPICall);

    

    $(".btn-primary").on("click", function(){
        console.log("City Button is clicked");
    
        var savedDesc = localStorage.getItem($(this).attr("id")); 
        console.log("This is the saved description " + savedDesc);
    });
    */

});

function searchHistroy(){
    console.log("The search history function is now running");
    var cityName = $("#inputPassword2").val();

    if (!cityName.length){
        console.log("City Name is empty");
        $("#inputPassword2").attr("placeholder", "Please enter a city");
        return;
    }

    console.log("This is the city name: " + cityName);

    var $existingButton = $("#search-button");
  
    var $newButton = $existingButton.clone();
   
    $newButton.text(cityName); 
    $newButton.attr("id", cityName);
    $newButton.addClass("cityButton")

    $("#cityBreak").after($newButton);

   
    populateMainHeader(cityName);
   

}



async function populateMainHeader(cityName){

    var APICALL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKEY +"&units=imperial";
    
    fetch(APICALL)
        .then(function(response){
            console.log(response);
            
            return response.json();

        })
        .then(function(data){
            console.log(data);
            localStorage.setItem(cityName, JSON.stringify(data));
            
            $("#mainCityName").text(cityName);
            mainTemp = data.main.temp;
            console.log("Temp: " + mainTemp);
            $("#mainTemp").text("Current Tempature: " + mainTemp + " F");

            mainWind=data.wind.speed;
            console.log("Wind Speed" + mainWind);
            $("#mainWind").text("Current Wind Speed: " + mainWind + " mph");

            mainHumidity = data.main.humidity; 
            console.log("Current Humidity: " + mainHumidity);
            $("#mainHumidity").text("Current Humidity: " + mainHumidity + "%");

            
        });

        setTimeout(() => { populateFiveDay(cityName);}, 500);
        
}

function populateFiveDay(cityName){

    var savedData = JSON.parse(localStorage.getItem(cityName));
    console.log(savedData);
    var cityLat = savedData.coord.lat;
    var cityLon = savedData.coord.lon;
    console.log("Coord Values " + cityLat + cityLon);
    var appendedName = cityName + "-5day";

    var forecastAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=33.7459&lon=-117.8262&exclude=houly&appid=" + APIKEY+"&units=imperial";
    console.log(forecastAPI);

    fetch(forecastAPI)
        .then(function(response){
            console.log(response);
            
            return response.json();

        }) .then(function(data){
            console.log(data);
            
            localStorage.setItem(appendedName, JSON.stringify(data));
        });

        setTimeout(() => { getAverageValues(appendedName);}, 500);

}

function getAverageValues(name){
    var savedData = JSON.parse(localStorage.getItem(name));
    var temp = savedData.list[0].dt_txt;
    var lengths = savedData.list.length;

    console.log(temp + " "+ lengths);
    let result = temp.includes("04-22");
    console.log(result);

    var tempArrayMax = [];
    var tempArrayMin = [];
    var humidityArray = [];

    for ( var i = 0; i < savedData.list.length;i++ ){
        console.log("This is loop: " + i);
        var temp = savedData.list[i].dt_txt;
        if(temp.includes("04-22")){
           
            tempArrayMax.push(savedData.list[i].main.temp_max);
            tempArrayMin.push(savedData.list[i].main.temp_min);
            humidityArray.push(savedData.list[i].main.humidity);

        }
    }

    console.log(tempArrayMax);
    console.log(tempArrayMin);
    var actuallMaxAverage = getAverage(tempArrayMax);
    console.log("This is the sum of the tempMAX "+ actuallMaxAverage);
    var actuallMinAverage = getAverage(tempArrayMin);
    console.log("This is the sum of the tempMIN "+ actuallMinAverage);
    var averageHimidity = getAverage(humidityArray);
    console.log("This is the sum of the averageHimidity "+ averageHimidity);
    $("#date-1").find("#cardHighTemp").text("Highs of: "+ Math.trunc(actuallMaxAverage) + " °F");
    $("#date-1").find("#cardLowTemp").text("Lows of: " + Math.trunc(actuallMinAverage) + " °F");
    $("#date-1").find("#cardHumidity").text("Humidity: " +Math.trunc(averageHimidity) + "%");

}

function getAverage(array){

    console.log("Get Average is running");

    var sum = 0;
    array.forEach(item => {
    sum += item;
    });

    var average = sum / array.length;

    return average;
  


}



$("#search-button").click(function(){
    searchHistroy();
});

