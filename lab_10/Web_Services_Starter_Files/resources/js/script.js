//helper functions
var dayOfWeek = "";
function formatDate(date, month, year)
{
  month = (month.length < 2) ? ('0' + month) : month;
  date = (date.length < 2)? ('0' + date) : date;
  return [year,month,date].join('-');
}
function getDayofWeek(date, month, year){
  var week_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dayOfWeek =  week_names[new Date([month,date,year].join('-')).getDay()];
}
function getFarenheitTemp(temp){
  return (9*temp/5)+32;
}

//run when the document object model is ready for javascript code to execute, 40.0150° N, 105.2705° W
$(document).ready(function() {
  //Place your weatherstack API Call Here - access_key to be used: 5bc82451636190abd9d7afe6fe9b20b5
// / https://api.weatherstack.com/forecast?access_key={key}&query={latitude},{longitude}&forecast_days={number_of_days}

  var url = 'https://api.weatherstack.com/forecast?access_key=5bc82451636190abd9d7afe6fe9b20b5&query=Boulder&forecast_days=5';
  console.log("after api call");//View Today's Temp

  $.ajax({url:url, dataType:"jsonp"}).then(function(data) {
    console.log(data);//Review all of the data returned

		console.log("Current Temp: " + data.current.temperature);//View Today's Temp
		var current_time = new Date(data.location.localtime);//Retrieve the current timestamp
		console.log(current_time.getDay());
    /*
      Read the current weather information from the data point values [https://weatherstack.com/documentation] to
      update the webpage for today's weather:

      1. image_today : This should display an image for today's weather.
               This will use the icon that is returned by the API. You will be looking for the weather_icons key in the response.*/

    //  var image_src = data.current.weather_icons
//jquery it up
      $("#image_today").attr("src", data.current.weather_icons[0]);


        /*2. location: This should be appended to the heading. For eg: "Today's Weather Forecast - Boulder"*/

        $("#heading").text(data.location.name);




        /*3. temp_today : This will be updated to match the current temperature. Use the getFarenheitTemp to convert the temperature from celsius to farenheit.*/
        var temp_f = getFarenheitTemp(data.current.temperature);
        console.log("Current F Temp: " + temp_f);//View Today's Temp




        $("#temp_today").text(temp_f);


      /*  4. thermometer_inner : Modify the height of the thermometer to match the current temperature. This means if the
                   current temperature is 32 F, then the thermometer will have a height of 32%.  Please note,
                   this thermometer has a lower boundary of 0 and upper boundary of 100.*/

                   if (temp_f > 100) {
                     console.log("temp! out of bounds");//
                     $("#thermometer_inner").text(100);

                   }
                   else if (temp_f < 0) {
                     console.log("temp! out of bounds");//
                     $("#thermometer_inner").text( 0);
                   }

                   else{

                  //   var temp_X = temp_f * 100;
                    // console.log("temp x = " + temp_X);//View Today's Temp

                   $("#thermometer_inner").text(temp_f + " Farenheit");
                   $("#thermometer_inner").height(temp_f * 3);

                   console.log($("#thermometer_inner").css("height")  + " curren temp height");//View Today's Temp

                   }


      /*  5. precip_today : This will be updated to match the current probability for precipitation. Be sure to check the unit of the value returned and append that to the value displayed.*/
      var precip = data.current.precip;
      var precip_s = precip.toString();

      console.log("precip is : " + precip_s + typeof(precip_s));
      $("#precip_today").text(precip + "%");





      /*  6. humidity_today : This will be updated to match the current humidity percentage (make sure this is listed as a*/
        /*          percentage %)*/
        var humid = data.current.humidity;
        console.log("humid is : " + humid);
        $("#humidity_today").text(humid + "%");


      /*  7. wind_today : This will be updated to match the current wind speed.*/
      var w_speed = data.current.wind_speed
      console.log("w speed  is : " + w_speed);
      $("#wind_today").text(w_speed );



      /*  8. summary_today: This will be updated to match the current summary for the day's weather.*/
      $("#summary_today").text(data.current.weather_descriptions);



    //helper function - to be used to get the key for each of the 5 days in the future when creating cards for forecasting weather
    function getKey(i){
        var week_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
        dayOfWeek=week_names[new Date(Object.keys(data.forecast)[i]).getDay()];
        return data.forecast[Object.keys(data.forecast)[i]];
    }
    /* Process the daily forecast for the next 5 days */

    /*
      For the next 5 days you'll need to add a new card listing:
        1. The day of the week
        2. The temperature high
        3. The temperature low
        4. Sunrise
        5. Sunset

      Each card should use the following format:
      <div style="width: 20%;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title"><!-- List Day of the Week Here --></h5>
            <p class="card-text">High:<!--List Temperature High --> <br>
              Low: <!-- List Temperature Low --><br>
              Sunrise: <!-- List Time of Sunrise --><br>
              Sunset: <!-- List Time of Sunset --></p>
          </div>
        </div>
      </div>

      <Hint1 - To access the forecast data> You need to make sure to carefully see the JSON response to see how to access the forecast data.
       While creating the key to access forecast data make sure to convert it into a string using the toString() method.

      <Hint2 - To add the cards to the HTML> - Make sure to use string concatenation to add the html code for the daily weather cards.  This should
      be set to the innerHTML for the 5_day_forecast.
    */

    //get the key, loop through, then put it into the html okay

//    var day = 4
//    var temp_hi = 4
//    var temp_lo = 4
//    var sunrise = 4
    //var sunset =  4

    for(var x = 0; x<5; x++) // loop through each card then
    {
      console.log("x is : "+ x);//View Today's Temp

        var key = getKey(x);
        console.log("key recieved is : "+ key + typeof(key));//View Today's Temp
//        console.log(data.forecast);//View Today's Temp


    //    new Date =

        var temp_hi = key.maxtemp;
        temp_hi = getFarenheitTemp(temp_hi);   //dont forget to convert it into F
        //grab temps
        var temp_lo = key.mintemp;
        temp_lo = getFarenheitTemp(temp_lo);

        var sunrise = key.astro.sunrise; //get sunrise + sunset
        var sunset = key.astro.sunset;


        var fore = document.getElementById("5_day_forecast"); //pull it on
        var html ="";

        html += "<div style='width: 20%;'>";
        html += "<div class='card' id = 'i'>";
        html += "<div class='card-body'>";
        html += "<h5 class='card-title'> "+dayOfWeek+" </h5>";     //add each value as it is
        html += "<p class='card-text'>High: "+temp_hi+"F<br>";
        html += "Low: "+temp_lo+"F <!-- List Temperature Low --><br>";
        html += "Sunrise: "+sunrise+" <!-- List Time of Sunrise --><br>";
        html += "Sunset: "+sunset +" <!-- List Time of Sunset --></p>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
        fore.innerHTML += html;
   }
  })
});
