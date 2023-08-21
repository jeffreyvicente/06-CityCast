//Open Weather API KEY
var APIKEY = "8c1158ac1ae5b174648a81890c6e113f";
// mainTemp object declaration 
var mainTemp;
//mainWind object delaration
var mainWind;
//mainHumidity object delaration
var mainHumidity;

//DayJS variables formating the date for the application
var currentDate = dayjs().format("MM-DD-YYYY");
var hardCurrentDate = dayjs();

//Function running when the page is loaded. 
$(function(){
   
    /*
    //console.log(currentDate);
    var currentHour =  dayjs('2023-04-15 14:00').hour(); // gets current hourv
    //console.log("This is the current hour " + currentHour);

    var temp = dayjs().isAfter(dayjs("2023-04-22 09:00:00"));
    //console.log (temp);
    */
    //Runs the dateID function to set the 5 day dates
    dateID();
    //Grabs the search history and creates button.
    parseHistory();
    
    //Button listener to listen to newly created city
    $(document).on("click", ".cityButton", function() {

        //grabs the button id which is set to the city name
        var cityName = $(this).attr("id");
        //console.log(cityName);
        //Calls the function to populate the main header and grab the 5 day.
        populateMainHeader(cityName);
      });

});

//Button listener to listen when the search button is clicked. 
$("#search-button").click(function(){
    //Calls the search history function to run
    searchHistroy();
});

//Parses the search history when the page is reloaded. 
function parseHistory(){
    //gets the city button array that holds the city history and declares them as buttonDataArray
    //If array does not exist create the array. 
    var buttonDataArray = JSON.parse(localStorage.getItem("cityButtons")) || [];
    //Runs the createCityButton for each city in the array
    for (var i = 0; i < buttonDataArray.length; i++) {
      var buttonData = buttonDataArray[i];
      createCityButton(buttonData.text);
    }
}

//Function that 5 day headers dates
function dateID(){
    //Four loop to grab the dates of the next 5 days
    for(var i = 0; i < 5; i++){
        //Adds 24 hours to the date to generate the 5 day
        var formatedDateID = dayjs().add(i + 1, "day").format('MM-DD-YYYY');
        //Sets the card ID
        $(".card-" + i).attr("id", formatedDateID);
        //Sets the text header 
        $("#head-" + i).text(formatedDateID);
    }
}

// 
function searchHistroy(){
    //console.log("The search history function is now running");
    //Grabs the text enter in the search bar and assigns it to cityName
    var cityName = $("#inputPassword2").val();

    //Checks if the array is empty, prompts the user to enter a city if none is entered. 
    if (!cityName.length){
        console.log("City Name is empty");
        $("#inputPassword2").attr("placeholder", "Please enter a city");
        return;
    }

    //console.log("This is the city name: " + cityName);

    //Adds the city to history and on the page
    createCityButton(cityName)
   
    //Call the function to populate the current weather section
    populateMainHeader(cityName);
   
}

//Creates the buttons under the search bar after searching for the weather of the city. 
function createCityButton(cityName) {
    //gets the atributes of the search button
    var $existingButton = $("#search-button");
    //clones the search button.
    var $newButton = $existingButton.clone();
    //sets the button text to the city name
    $newButton.text(cityName);
    //sets the id of the button to the city name
    $newButton.attr("id", cityName);
    //changes the jquary from primary to secondary
    $newButton.removeClass("btn-primary")
    //adds the citybutton class 
    $newButton.addClass("cityButton btn-secondary");
    //adds the button after the breakline. 
    $("#cityBreak").after($newButton);


    //Calls the cityButtons from local storage, if the object does not exist it will create it. 
    var buttonDataArray = JSON.parse(localStorage.getItem("cityButtons")) || [];

    //Array object created for holding the data 
    var buttonData = {
        id: cityName,
        text: cityName,
        class: "cityButton"
    };

    //Checks if there is a duplicate in the history. If so it will not store the data. 
    if (!buttonDataArray.find(function(item) { 
        return item.id === buttonData.id 
    })) {
        //addes the data to the array
        buttonDataArray.push(buttonData);
        //saves the data to local storage. 
        localStorage.setItem("cityButtons", JSON.stringify(buttonDataArray));
    }
 }
 
//will get the weather data and display it on the main header area
function populateMainHeader(cityName){
    
    //API link that construct the url
    var APICALL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKEY +"&units=imperial";
    
    //Calls the openweather API for the current day. 
    fetch(APICALL)
        .then(function(response){
         
           if(response.status === 404){
            alert("Invalid City. Please try again!");        
           }
            return response.json();

        })
        .then(function(data){
           console.log(data);
           //sets the city day as the key and the string in local storage. 
            localStorage.setItem(cityName, JSON.stringify(data));
            
            //Sets the name of the header to the city name
            $("#mainCityName").text(cityName + " " + currentDate);

            //sets the temp to the main header
            mainTemp = data.main.temp;
            //console.log("Temp: " + mainTemp);
            $("#mainTemp").text("Current Tempature: " + mainTemp + " F");

            //sets the wind to the main header
            mainWind=data.wind.speed;
            //console.log("Wind Speed: " + mainWind);
            $("#mainWind").text("Current Wind Speed: " + mainWind + " mph");

            //sets the Humidity to the main header
            mainHumidity = data.main.humidity; 
           // console.log("Current Humidity: " + mainHumidity);
            $("#mainHumidity").text("Current Humidity: " + mainHumidity + "%");

            var mainWeatherIcon = data.weather[0].icon;
            console.log("This is the value of mainWeatherIcon: " + mainWeatherIcon); 

            //gets the weather icon from the ID the API returns
            //$(mainWeatherIcon).find('#weatherIcon').attr("src", "./assets/images/" + weatherIcon +"@2x.png" );
            $("#mainWeatherIcon").attr("src", "./assets/images/" + mainWeatherIcon + "@2x.png" );
       

            //Sets the data to the data array and saves it local storage
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

            //calls the newfun function. Sets a delay of 400ms due to api response. 
        setTimeout(() => {  newfun(cityName);}, 900);   
}


function newfun(cityName){
    console.log("--------------------------------------------------");
    // console.log("Running newfun function");

    //Grabs the lon and lat from local storage from the function before. 
    var savedData = JSON.parse(localStorage.getItem(cityName));
    var cityLat = savedData[0].lat;
    var cityLon = savedData[0].lon;

    // API Call containing the lon and lat. Will return the 5 day data. 
    var fiveForecastAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + 
    cityLon +  "&exclude=houly&appid=" + APIKEY + "&units=imperial";
    
    //fetches the 5 day weather data fom open weather
    fetch(fiveForecastAPI)
    .then(function(response){
       // console.log(response);
        
        return response.json();

    }) .then(function(data){
        //console.log(data);
        //stores the data to local storage
        localStorage.setItem(cityName+"-5day", JSON.stringify(data));
    })
    .catch(function(error) {
        // Handle the error if the response is a 404
        console.error(error.message);
    });

    setTimeout(() => {  fiveDay(cityName);}, 900);
}


function fiveDay (cityName){
    console.log("--------------------------------------------------");
 
   //different formats of day data 
    var plusOneDay = hardCurrentDate.add(24, "hour").format('YYYY-MM-DD');
    var formatedPlusOneDay= hardCurrentDate.add(24, "hour").format('YYYY-MM-DD HH:MM:ss');
    console.log("This is the value of formatedPlus: " + formatedPlusOneDay);
    console.log("This is the value of plus one day " + plusOneDay);

    //gets the 5day data in local storage
    var savedData = JSON.parse(localStorage.getItem(cityName+"-5day"));

    //declares the weather array index as a global variable. 
    var weatherArrayIndex;
    //populates the 5 day data in the cards. 
    for (var x = 0; x < 5; x++){
        
        //iterates though the data returned from the API. 
        for( var i = 0; i < savedData.list.length ; i++){
            //grabs the date in the array
            var arrayDate = (savedData.list[i].dt_txt);
            
            //checks if the date matches the current date that needs to be populated. 
            if(arrayDate.includes(plusOneDay)){
                //creates dayjs objects

                var tempA = dayjs(arrayDate);
                var tempB = dayjs(formatedPlusOneDay);

                //grabs the difference between the current day and time
                var diffMinute = tempA.diff(tempB, 'minute');
                //console.log(diffMinute);
                //checks if the data is current
                if( diffMinute < 90 && diffMinute > -90){

                console.log("This is the index " + i);
                    weatherArrayIndex = i;
                    //var windSpeed = savedData.list[weatherArrayIndex].wind.speed
                    //console.log("This is the value of windSpeed " + windSpeed);
                    var appendedValue = "#"+tempA.format('MM-DD-YYYY');
                    //console.log(tempA.format('MM-DD-YYYY') + " " + appendedValue);
                    //$(appendedValue).find('#cardWind').text(windSpeed);
                    //calls the apply value function. 
                    applyValues(appendedValue,weatherArrayIndex,savedData);

                }
            }
        }
        //iterates the day counter to another day. 
        plusOneDay = dayjs(plusOneDay).add(24, "hour").format('YYYY-MM-DD');
        formatedPlusOneDay = dayjs(formatedPlusOneDay).add(24, "hour").format('YYYY-MM-DD HH:MM:ss');
    }
}

//Function to apply all the values to the 5 day cards 
function applyValues(appendedValue, arrayData, savedData){
    //gets the weather icon code
    var weatherIcon = savedData.list[arrayData].weather[0].icon;
    //gets the windspeed from the array
    var windSpeed = savedData.list[arrayData].wind.speed;
    //gets the saved humidity from the array
    var humidity = savedData.list[arrayData].main.humidity;
    //gets the saved temp from the array
    var futureTemp = savedData.list[arrayData].main.temp;

    console.log("This is the value in apply Value Icon: " + weatherIcon);
    //Sets the icon in the card
    $(appendedValue).find('#weatherIcon').attr("src", "./assets/images/" + weatherIcon +"@2x.png" );
    //Sets the wind, temp and humidity in the 5 day card. 
    $(appendedValue).find('#cardWind').text("Wind: " +windSpeed + " mph");
    $(appendedValue).find("#cardHighTemp").text("Currently: "+ futureTemp + " °F");
    $(appendedValue).find("#cardHumidity").text("Humidity: " +humidity + "%");
}
