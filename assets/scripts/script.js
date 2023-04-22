

var APIKEY = "8c1158ac1ae5b174648a81890c6e113f";
var city = "Tustin"
var mainTemp;
var mainWind;
var mainHumidity;

var currentDate = dayjs().format('2023-04-22');
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


    var currentHour =  dayjs('2023-04-15 14:00').hour(); // gets current hourv
    console.log("This is the current hour " + currentHour);

    var temp = dayjs().isAfter(dayjs("2023-04-22 09:00:00"));
    console.log (temp);

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

    var forecastAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + 
    cityLon +  "&exclude=houly&appid=" + APIKEY+"&units=imperial";
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
    var windArray =[];
   
    currentDate = dayjs().format("YYYY-MM-DD");
    var formatedCurrentDate = dayjs().format("MM/DD/YYYY");
    for(var x = 0; x < 5; x++){
    

    for ( var i = 0; i < savedData.list.length;i++ ){
        //console.log("This is loop: " + i);
        var temp = savedData.list[i].dt_txt;
        console.log ("This is the currentDate: " + currentDate);
        if(temp.includes(currentDate)){
           
            tempArrayMax.push(savedData.list[i].main.temp_max);
            tempArrayMin.push(savedData.list[i].main.temp_min);
            humidityArray.push(savedData.list[i].main.humidity);
            windArray.push(savedData.list[i].wind.speed);

        }

    }

    console.log(tempArrayMax);
    console.log(Math.max(...tempArrayMax));
    console.log(tempArrayMin);
    console.log(Math.max(...tempArrayMax));
    console.log(Math.min(...tempArrayMin));
    var actuallMaxAverage = getAverage(tempArrayMax);
    console.log("This is the sum of the tempMAX "+ actuallMaxAverage);
    var actuallMinAverage = getAverage(tempArrayMin);
    console.log("This is the sum of the tempMIN "+ actuallMinAverage);
    var averageHimidity = getAverage(humidityArray);
    console.log("This is the sum of the averageHimidity "+ averageHimidity);
    var averageWind= getAverage(windArray);
    console.log("This is the sum of the average !!!!!!!!!!!!!!!!!!!!!"+ averageWind);

    var appendedValue = "#date-" + x;
    console.log(appendedValue);
    //var appendedValue2 = "#head-" + x;
    //console.log(appendedValue2);
    $("#head-" + x).text(formatedCurrentDate);
    //$("#date-1").find("#cardHighTemp").text("Highs of: "+ Math.trunc(actuallMaxAverage) + " °F");
    $(appendedValue).find("#cardHighTemp").text("Highs of: "+ Math.max(...tempArrayMax) + " °F");
    $(appendedValue).find("#cardLowTemp").text("Lows of: " + Math.min(...tempArrayMin) + " °F");
    $(appendedValue).find("#cardHumidity").text("Humidity: " +Math.trunc(averageHimidity) + "%");
    $(appendedValue).find("#cardWind").text("Wind: " +Math.trunc(averageWind) + " mph");

    var tempArrayMax = [];
    var tempArrayMin = [];
    var humidityArray = [];
    var windArray =[];
    actuallMaxAverage = 0;
    actuallMinAverage = 0;
    averageHimidity = 0;
    averageWind = 0;

    var currentDate = dayjs();
    currentDate = currentDate.add(x + 1, 'day').format("YYYY-MM-DD");
  
    console.log("The new current date is " + currentDate);

    var formatedCurrentDate = dayjs();
    formatedCurrentDate = formatedCurrentDate.add(x + 1, 'day').format("MM/DD/YYYY");
}
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

