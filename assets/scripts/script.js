var APIKEY = "8c1158ac1ae5b174648a81890c6e113f";
var city = "Tustin"
var mainTemp;
var mainWind;
var mainHumidity;

var currentDate = dayjs().format("YYYY-MM-DD");
var hardCurrentDate = dayjs();

$(function(){
   
    /*
    //console.log(currentDate);
    var currentHour =  dayjs('2023-04-15 14:00').hour(); // gets current hourv
    //console.log("This is the current hour " + currentHour);

    var temp = dayjs().isAfter(dayjs("2023-04-22 09:00:00"));
    //console.log (temp);
    */
    dateID();
    parseHistory();
    
    $(document).on("click", ".cityButton", function() {

        var cityName = $(this).attr("id");
        console.log(cityName);
        populateMainHeader(cityName);
      });

});

$("#search-button").click(function(){
    searchHistroy();
});


function parseHistory(){
    var buttonDataArray = JSON.parse(localStorage.getItem("cityButtons")) || [];
    for (var i = 0; i < buttonDataArray.length; i++) {
      var buttonData = buttonDataArray[i];
      createCityButton(buttonData.text);
    }
}

function dateID(){

    for(var i = 0; i < 5; i++){
        var formatedDateID = dayjs().add(i + 1, "day").format('MM-DD-YYYY');
        $(".card-" + i).attr("id", formatedDateID);
        $("#head-" + i).text(formatedDateID);
    }
}


function searchHistroy(){
    //console.log("The search history function is now running");
    var cityName = $("#inputPassword2").val();

    if (!cityName.length){
        console.log("City Name is empty");
        $("#inputPassword2").attr("placeholder", "Please enter a city");
        return;
    }

    //console.log("This is the city name: " + cityName);

    createCityButton(cityName)
   
    populateMainHeader(cityName);
   
}

function createCityButton(cityName) {
    var $existingButton = $("#search-button");
    var $newButton = $existingButton.clone();
    $newButton.text(cityName);
    $newButton.attr("id", cityName);
    $newButton.removeClass("btn-primary")
    $newButton.addClass("cityButton btn-secondary");
    $("#cityBreak").after($newButton);

    /*
    var buttonDataArray = JSON.parse(localStorage.getItem("cityButtons")) || [];
   
    var buttonData = {
        id: cityName,
        text: cityName,
        class: "cityButton"
      };
     
      buttonDataArray.push(buttonData);

      localStorage.setItem("cityButtons", JSON.stringify(buttonDataArray));
  
    */  

    var buttonDataArray = JSON.parse(localStorage.getItem("cityButtons")) || [];

    var buttonData = {
        id: cityName,
        text: cityName,
        class: "cityButton"
    };

    if (!buttonDataArray.find(function(item) { 
        return item.id === buttonData.id 
    })) {
    buttonDataArray.push(buttonData);
    localStorage.setItem("cityButtons", JSON.stringify(buttonDataArray));
    }
 }
 

function populateMainHeader(cityName){
    
    var APICALL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKEY +"&units=imperial";
    
    fetch(APICALL)
        .then(function(response){
           // console.log(response);
           if(response.status === 404){
            alert("Invalid City. Please try again!");        
           }
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

            //$(mainWeatherIcon).find('#weatherIcon').attr("src", "./assets/images/" + weatherIcon +"@2x.png" );
            $(mainWeatherIcon).attr("src", "./assets/images/04d@2x.png" );

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
            }) .catch(function(error) {
            // Handle the error if the response is a 404
            console.error(error.message);
            });
        setTimeout(() => {  newfun(cityName);}, 400);   
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
    })
    .catch(function(error) {
        // Handle the error if the response is a 404
        console.error(error.message);
    });

    setTimeout(() => {  fiveDay(cityName);}, 400);
}


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

    $(appendedValue).find('#weatherIcon').attr("src", "./assets/images/" + weatherIcon +"@2x.png" );

    $(appendedValue).find('#cardWind').text("Wind: " +windSpeed + " mph");
    $(appendedValue).find("#cardHighTemp").text("Currently: "+ futureTemp + " °F");
    $(appendedValue).find("#cardHumidity").text("Humidity: " +humidity + "%");
}
