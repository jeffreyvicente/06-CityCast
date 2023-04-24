

var APIKEY = "8c1158ac1ae5b174648a81890c6e113f";
var city = "Tustin"
var mainTemp;
var mainWind;
var mainHumidity;

var currentDate = dayjs().format("YYYY-MM-DD");
var dataArray = [];
$(function(){
   

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

    

    //console.log(currentDate);
    var currentHour =  dayjs('2023-04-15 14:00').hour(); // gets current hourv
    //console.log("This is the current hour " + currentHour);

    var temp = dayjs().isAfter(dayjs("2023-04-22 09:00:00"));
    //console.log (temp);

    dateID();

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



function populateMainHeader(cityName){

    var APICALL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKEY +"&units=imperial";
    
    fetch(APICALL)
        .then(function(response){
           // console.log(response);
            
            return response.json();

        })
        .then(function(data){
           // console.log(data);
            localStorage.setItem(cityName, JSON.stringify(data));
            
            $("#mainCityName").text(cityName);
            mainTemp = data.main.temp;
            //console.log("Temp: " + mainTemp);
            $("#mainTemp").text("Current Tempature: " + mainTemp + " F");

            mainWind=data.wind.speed;
            //console.log("Wind Speed: " + mainWind);
            $("#mainWind").text("Current Wind Speed: " + mainWind + " mph");

            mainHumidity = data.main.humidity; 
           // console.log("Current Humidity: " + mainHumidity);
            $("#mainHumidity").text("Current Humidity: " + mainHumidity + "%");

            dataArray = [
                {
                    temp: mainTemp,
                    wind: mainWind,
                    humidity: mainHumidity,
                    lat: data.coord.lat,
                    lon: data.coord.lon,
                    time : data.dt
                }
            ];
            localStorage.setItem(cityName, JSON.stringify(dataArray));   
        });

        //newfun(cityName);
        setTimeout(() => {  newfun(cityName);}, 400);

        //setTimeout(() => { populateFiveDay(cityName);}, 500);
        
}

function newfun(cityName){
    console.log("--------------------------------------------------");
   // console.log("Running newfun function");

    var savedData = JSON.parse(localStorage.getItem(cityName));
    //console.log("This is newFun running with the value of savedData");
   // console.log(savedData);
   // console.log("This is the lon value: " + savedData[0].lon);
   // console.log("This is the lat value: " + savedData[0].lat);
    var cityLat = savedData[0].lat;
    var cityLon = savedData[0].lon;

    var fiveForecastAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + 
    cityLon +  "&exclude=houly&appid=" + APIKEY + "&units=imperial";
    
   // console.log("This the fiveForecastAPI");
   // console.log(fiveForecastAPI);

    fetch(fiveForecastAPI)
    .then(function(response){
       // console.log(response);
        
        return response.json();

    }) .then(function(data){
        //console.log(data);
        
        localStorage.setItem(cityName+"-5day", JSON.stringify(data));
    });

    setTimeout(() => {  fiveDay(cityName);}, 400);
}

//var hardCurrentDate = dayjs('2023-04-26 18:00:00');
var hardCurrentDate = dayjs();

function fiveDay (cityName){
    console.log("--------------------------------------------------");
    var temp = hardCurrentDate.format('YYYY-MM-DD HH:MM:ss');
   //console.log("This is the value of temp " + temp);
    var plusOneDay = hardCurrentDate.add(24, "hour").format('YYYY-MM-DD');
    var formatedPlusOneDay= hardCurrentDate.add(24, "hour").format('YYYY-MM-DD HH:MM:ss');
    console.log("This is the value of formatedPlus: " + formatedPlusOneDay);
    console.log("This is the value of plus one day " + plusOneDay);

    var savedData = JSON.parse(localStorage.getItem(cityName+"-5day"));
    //console.log(savedData);
    //tempa = dayjs('2023-04-24 17:10:00');
    //console.log(tempa);

    //var difference = tempa.diff(temp,'minute');
    //console.log("The difference is " + difference);

    var lowestDiff = Infinity;
    var weatherArrayIndex;
    for (var x = 0; x < 5; x++){
     
        for( var i = 0; i < savedData.list.length ; i++){

            var arrayDate = (savedData.list[i].dt_txt);
            //console.log("This is the value of arrayDate "+ arrayDate);
            //var diffMinute = arrayDate.diff(plusOneDay, 'minute');
            //var diffMinute = plusOneDay.diff(arrayDate, 'minute');
            //console.log("This is the value of diffMinute " + diffMinute);

            if(arrayDate.includes(plusOneDay)){
                //console.log(plusOneDay);
                var tempA = dayjs(arrayDate);
                var tempB = dayjs(formatedPlusOneDay);

                //console.log("This is in the if");
                var diffMinute = tempA.diff(tempB, 'minute');
                //console.log(diffMinute);
                if( diffMinute < 90 && diffMinute > -90){

                console.log("This is the index " + i);
                    weatherArrayIndex = i;
                    //var windSpeed = savedData.list[weatherArrayIndex].wind.speed
                    //console.log("This is the value of windSpeed " + windSpeed);
                    var appendedValue = "#"+tempA.format('MM-DD-YYYY');
                    //console.log(tempA.format('MM-DD-YYYY') + " " + appendedValue);
                    //$(appendedValue).find('#cardWind').text(windSpeed);
                    applyValues(appendedValue,weatherArrayIndex,savedData);

                }
                
            }
        }
        plusOneDay = dayjs(plusOneDay).add(24, "hour").format('YYYY-MM-DD');
        formatedPlusOneDay = dayjs(formatedPlusOneDay).add(24, "hour").format('YYYY-MM-DD HH:MM:ss');
    }
}

function applyValues(appendedValue, arrayData, savedData){
    var weatherIcon = savedData.list[arrayData].weather[0].icon;
    var windSpeed = savedData.list[arrayData].wind.speed;
    var humidity = savedData.list[arrayData].main.humidity;
    var futureTemp = savedData.list[arrayData].main.temp;
    //console.log("This is the value in apply Value speed: " + windSpeed)
    //console.log("This is the value in apply Value humidity: " + humidity);
    //console.log("This is the value in apply Value temp: " + futureTemp);
     console.log("This is the value in apply Value Icon: " + weatherIcon);

    $(appendedValue).find('#weatherIcon').attr("src", );

    $(appendedValue).find('#cardWind').text("Wind: " +windSpeed + " mph");
    $(appendedValue).find("#cardHighTemp").text("Currently: "+ futureTemp + " °F");
    $(appendedValue).find("#cardHumidity").text("Humidity: " +humidity + "%");


}



function dateID(){

   
    for(var i = 0; i < 5; i++){
        var formatedDateID = dayjs().add(i + 1, "day").format('MM-DD-YYYY');
        $(".card-" + i).attr("id", formatedDateID);
        $("#head-" + i).text(formatedDateID);
    }
}




/*

function populateFiveDay(cityName){

    console.log("--------------------------------------------------");
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
    let result = temp.includes("04-23");
    console.log(result);
    

    
    var tempArrayMax = [];
    var tempArrayMin = [];
    var humidityArray = [];
    var windArray =[];
   
    var currentDate1 = dayjs();
    currentDate1 = currentDate1.format("YYYY-MM-DD");
    console.log("This is the currentDate #1 " + currentDate1);

    //var currentDate = dayjs().format("YYYY-MM-DD");
    //var formatedCurrentDate = dayjs().format("MM/DD/YYYY");
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

*/

$("#search-button").click(function(){
    searchHistroy();
});

