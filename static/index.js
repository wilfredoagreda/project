let map;
let marker;
let geocoder;
let responseDiv;
let response;
let currentLat;
let currentLng;
let chart3;


//Run once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {

  //Calculation of geolocation
  document.getElementById('location').addEventListener('click', function(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
      document.querySelector('#latitude').value = position.coords.latitude;
      document.querySelector('#longitude').value = position.coords.longitude;

    })
  })


});
//function API google maps
function initMap() {
    currentLat = parseFloat(document.querySelector('#latitude').value)
    currentLng = parseFloat(document.querySelector('#longitude').value)
    currentLat = currentLat || 41.404056;
    currentLng = currentLng || 2.175012;
    // document.querySelector('#latitude').value = currentLat;
    // document.querySelector('#longitude').value = currentLng;
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: currentLat, lng: currentLng },
      mapTypeControl: false,
    });

    geocoder = new google.maps.Geocoder();
  
    const inputText = document.createElement("input");
  
    inputText.type = "text";
    inputText.placeholder = "Enter a location";
  
    const submitButton = document.createElement("input");
  
    submitButton.type = "button";
    submitButton.value = "Geocode";
    submitButton.classList.add("button", "button-primary");
  
    const clearButton = document.createElement("input");
  
    clearButton.type = "button";
    clearButton.value = "Clear";
    clearButton.classList.add("button", "button-secondary");
    response = document.createElement("pre");
    response.id = "response";
    response.innerText = "";
    responseDiv = document.createElement("div");
    responseDiv.id = "response-container";
    responseDiv.appendChild(response);
  
    const instructionsElement = document.createElement("p");
  
    instructionsElement.id = "instructions";
    instructionsElement.innerHTML =
      "<strong>Instructions</strong>: Enter an address in the textbox to geocode or click on the map.";
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);
    marker = new google.maps.Marker({
      map,
    });
    map.addListener("click", (e) => {
      geocode({ location: e.latLng });
    });
    submitButton.addEventListener("click", () =>
      geocode({ address: inputText.value }),
    );
    clearButton.addEventListener("click", () => {
      clear();
    });
    clear();
  
}
//function API google maps
function clear() {
  marker.setMap(null);
  responseDiv.style.display = "none";
}
//function API google maps
function geocode(request) {
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      // responseDiv.style.display = "block";
      // response.innerText = JSON.stringify(result, null, 2);
      // return results;
      document.querySelector('#latitude').value = results[0].geometry.location.lat();
      document.querySelector('#longitude').value = results[0].geometry.location.lng();
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}
//function to display chart step1
function initChart() {
  let data = document.querySelectorAll('#weibull');
  let data2 = document.querySelectorAll('#weibull_direction');
  const parsedData = []
  const labels = []
  //convert the data bar chart
  data.forEach((item,index) => {
    parsedData.push(parseFloat(item.dataset.name))
    labels.push(index)

  });
  //convert data wind rose chart
  const parsedData2 = []
  data2.forEach((item2) => {
    parsedData2.push(parseFloat(item2.dataset.name))
  });
  

  const ctx = document.getElementById('graph').getContext('2d');
  const ctx2 = document.getElementById('wind_rose').getContext('2d');

const chart = new Chart(ctx, {

  data: {
    labels: labels,
    datasets: [{
      label: 'Frecuency',
      data: parsedData,
      backgroundColor: 'rgba(86, 204, 157)',
      type: 'bar',
    },
    
    {
      label: 'Curve linearization',
      data: parsedData,
      backgroundColor: 'black',
      type: 'line',
    }
  ]
  },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'WEIBULL FRECUENCY DISTRIBUTION',
          font: {
            size: 20,
            family: 'Helvetica Neue'
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Wind speed (m/s)',

          }
    },
  }
    }
    
  });

  const chart2 = new Chart(ctx2, {

    data: {
      labels: ['N', 'NNE', 'ENE', 'E', 'ESE', 'SSE', 'S', 'SSW', 'WSW', 'W', 'WNW', 'NNW'],
      datasets: [{
        label: 'Frecuency',
        data: parsedData2,
        type: 'radar',
        fill: true,
        backgroundColor: 'rgba(86, 204, 157, 0.2)',
        borderColor: 'rgb(86, 204, 157)',
        pointBackgroundColor: 'rgb(86, 204, 157)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(86, 204, 157)'
      },
    ]
    },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 3
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'DIRECTION FRECUENCY DISTRIBUTION',
            font: {
              size: 20,
              family: 'Helvetica Neue'
            }
          }
        },

      }
      
    });



}

document.addEventListener('DOMContentLoaded', function() {

  //Calculate power of turbine
  document.getElementById('turbine').addEventListener('click', function(event) {
    event.preventDefault();
    let data = document.querySelectorAll('#weibull');
    const parsedData3 = []
    const labels3 = []
    data.forEach((item,index) => {
      parsedData3.push(parseFloat(item.dataset.name))
      labels3.push(index)
  
    });
    var radios = document.getElementsByName('optionsRadios');
  
      for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          break;
        }
      }
      let option=String(radios[i].value);
      let result = option.localeCompare("option1");
      let result2 = option.localeCompare("option2");
      let result3 = option.localeCompare("option3");
      let result4 = option.localeCompare("option4");
      let result5 = option.localeCompare("option5");
      let result6 = option.localeCompare("option6");
  
      //power of turbine in watts
      let wind13 = [0, 0, 10, 40, 70, 150, 250, 375, 500, 600, 750, 850, 950, 1000, 700, 450, 300, 250, 250, 250, 250];
      let enair30 = [0, 0, 0, 10, 100, 300, 650, 1000, 1450, 1850, 2100, 2300, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500];
      let wind25 = [0, 0, 0, 50, 225, 450, 750, 1200, 1650, 2150, 2900, 3600, 4400, 5000, 4500, 3700, 2900, 2100, 1400, 1100, 1100];
      let enair70 = [0, 0, 0, 40, 155, 450, 925, 1400, 2100, 2800, 3400, 4000, 4150, 4300, 4375, 4450, 4475, 4500, 4475, 4450, 4425];
      let atlas7 = [0, 0, 13, 30, 256, 482, 752, 1176, 1694, 2765, 3710, 4372, 5327, 6153, 6762, 6942, 7032, 7032, 7032, 7032, 7032];
      let atlasx = [0, 0, 13, 30, 101, 256, 482, 617, 752, 1176, 1694, 2765, 3710, 4372, 5327, 6153, 6762, 6942, 7032, 7032, 7032];
      let option_selected = 0;
      let model = "";

      //select turbine  
      if (result == 0) 
        {
          option_selected = wind13;
          model = "Bornay Wind 13+ 1kW"
  
        }
      else if (result2 == 0)
        {
          option_selected = enair30;
          model = "Enair 30 PRO 3kW"
        }
      else if (result3 == 0)
        {
          option_selected = wind25;
          model = "Bornay Wind 25.3+ 5kW"
        }
      else if (result4 == 0)
        {
          option_selected = enair70;
          model = "Enair 70 PRO 5.5kW"
        }
      else if (result5 == 0)
        {
          option_selected = atlas7;
          model = "Atlas 7 7kW"
        }
      else if (result6 == 0)
        {
          option_selected = atlasx;
          model = "Atlas X7 7kW"
        }
  
      //Calculate power average
      let power = [];
      let Sumpower = 0;
      for (var j = 0; j < data.length; j++)  //loops through the array 
      {
        power[j] = parseFloat(parsedData3[j])*parseFloat(option_selected[j]);
        Sumpower = Sumpower + power[j];
  
      }
  
        //Energy per day with loss of 12%
      let energy_day = 0;
      let energy_year = 0;
      Sumpower = parseFloat(Sumpower.toFixed(2));
      energy_day = parseFloat((Sumpower*24*(1-0.12)/1000).toFixed(2));
      energy_year = parseFloat((energy_day * 365).toFixed(2));
      document.querySelector('#energy_avg').innerText = Sumpower;
      document.querySelector('#energy_day').innerText = energy_day;
      document.querySelector('#energy_year').innerText = energy_year;
      document.querySelector('#model').innerText = model;
  
      //create chart for turbine model
      const ctx3 = document.getElementById('graph2').getContext('2d');
      if (chart3) {
        chart3.destroy();
      }
  
      chart3 = new Chart(ctx3, {
        
  
        data: {
          labels: labels3,
          datasets: [{
            label: 'Frecuency',
            data: option_selected,
            backgroundColor: 'rgba(86, 204, 157)',
            type: 'bar',
          },
          
          {
            label: 'Curve linearization',
            data: option_selected,
            backgroundColor: 'black',
            type: 'line',
          }
        ]
        },

          options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'POWER CURVE',
                font: {
                  size: 20,
                  family: 'Helvetica Neue'
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Wind speed (m/s)',
  
                }
          },
          y: {
              title: {
                display: true,
                text: 'Power (W)',
              }
        },
        }

          },

          
        })
  


    })
  //Calculation of comsuption
  document.getElementById('consumption').addEventListener('click', function(event) {
      event.preventDefault();
      //get elements information
      let element1 = document.querySelector('#input1');
      let element2 = document.querySelector('#input2');
      let element3 = document.querySelector('#input3');
      let element4 = document.querySelector('#input4');
      let element5 = document.querySelector('#input5');
      let element6 = document.querySelector('#input6');
      let element7 = document.querySelector('#input7');
      let element8 = document.querySelector('#input8');
      let element9 = document.querySelector('#input9');
      let element10 = document.querySelector('#input10');
      let element11 = document.querySelector('#input11');
      let element12 = document.querySelector('#input12');
      let element13 = document.querySelector('#input13');
      let element14 = document.querySelector('#input14');
      let element15 = document.querySelector('#input15');
      let element1hr = document.querySelector('#inputhr1');
      let element2hr = document.querySelector('#inputhr2');
      let element3hr = document.querySelector('#inputhr3');
      let element4hr = document.querySelector('#inputhr4');
      let element5hr = document.querySelector('#inputhr5');
      let element6hr = document.querySelector('#inputhr6');
      let element7hr = document.querySelector('#inputhr7');
      let element8hr = document.querySelector('#inputhr8');
      let element9hr = document.querySelector('#inputhr9');
      let element10hr = document.querySelector('#inputhr10');
      let element11hr = document.querySelector('#inputhr11');
      let element12hr = document.querySelector('#inputhr12');
      let element13hr = document.querySelector('#inputhr13');
      let element14hr = document.querySelector('#inputhr14');
      let element15hr = document.querySelector('#inputhr15');
      let element1un = document.querySelector('#inputun1');
      let element2un = document.querySelector('#inputun2');
      let element3un = document.querySelector('#inputun3');
      let element4un = document.querySelector('#inputun4');
      let element5un = document.querySelector('#inputun5');
      let element6un = document.querySelector('#inputun6');
      let element7un = document.querySelector('#inputun7');
      let element8un = document.querySelector('#inputun8');
      let element9un = document.querySelector('#inputun9');
      let element10un = document.querySelector('#inputun10');
      let element11un = document.querySelector('#inputun11');
      let element12un = document.querySelector('#inputun12');
      let element13un = document.querySelector('#inputun13');
      let element14un = document.querySelector('#inputun14');
      let element15un = document.querySelector('#inputun15');

      //calculate total power
      let total_power1 = parseFloat(((element1.value * element1un.value)/1000).toFixed(2));
      let total_power2 = parseFloat(((element2.value * element2un.value)/1000).toFixed(2));
      let total_power3 = parseFloat(((element3.value * element3un.value)/1000).toFixed(2));
      let total_power4 = parseFloat(((element4.value * element4un.value)/1000).toFixed(2));
      let total_power5 = parseFloat(((element5.value * element5un.value)/1000).toFixed(2));
      let total_power6 = parseFloat(((element6.value * element6un.value)/1000).toFixed(2));
      let total_power7 = parseFloat(((element7.value * element7un.value)/1000).toFixed(2));
      let total_power8 = parseFloat(((element8.value * element8un.value)/1000).toFixed(2));
      let total_power9 = parseFloat(((element9.value * element9un.value)/1000).toFixed(2));
      let total_power10 = parseFloat(((element10.value * element10un.value)/1000).toFixed(2));
      let total_power11 = parseFloat(((element11.value * element11un.value)/1000).toFixed(2));
      let total_power12 = parseFloat(((element12.value * element12un.value)/1000).toFixed(2));
      let total_power13 = parseFloat(((element13.value * element13un.value)/1000).toFixed(2));
      let total_power14 = parseFloat(((element14.value * element14un.value)/1000).toFixed(2));
      let total_power15 = parseFloat(((element15.value * element15un.value)/1000).toFixed(2));

      //calculate total power per day
      let total_power1_day = parseFloat((total_power1 * element1hr.value).toFixed(2));
      let total_power2_day = parseFloat((total_power2 * element2hr.value).toFixed(2));
      let total_power3_day = parseFloat((total_power3 * element3hr.value).toFixed(2));
      let total_power4_day = parseFloat((total_power4 * element4hr.value).toFixed(2));
      let total_power5_day = parseFloat((total_power5 * element5hr.value).toFixed(2));
      let total_power6_day = parseFloat((total_power6 * element6hr.value).toFixed(2));
      let total_power7_day = parseFloat((total_power7 * element7hr.value).toFixed(2));
      let total_power8_day = parseFloat((total_power8 * element8hr.value).toFixed(2));
      let total_power9_day = parseFloat((total_power9 * element9hr.value).toFixed(2));
      let total_power10_day = parseFloat((total_power10 * element10hr.value).toFixed(2));
      let total_power11_day = parseFloat((total_power11 * element11hr.value).toFixed(2));
      let total_power12_day = parseFloat((total_power12 * element12hr.value).toFixed(2));
      let total_power13_day = parseFloat((total_power13 * element13hr.value).toFixed(2));
      let total_power14_day = parseFloat((total_power14 * element14hr.value).toFixed(2));
      let total_power15_day = parseFloat((total_power15 * element15hr.value).toFixed(2));

      //result of total power in html text
      document.querySelector('#total_power1').innerText = total_power1;
      document.querySelector('#total_power2').innerText = total_power2;
      document.querySelector('#total_power3').innerText = total_power3;
      document.querySelector('#total_power4').innerText = total_power4;
      document.querySelector('#total_power5').innerText = total_power5;
      document.querySelector('#total_power6').innerText = total_power6;
      document.querySelector('#total_power7').innerText = total_power7;
      document.querySelector('#total_power8').innerText = total_power8;
      document.querySelector('#total_power9').innerText = total_power9;
      document.querySelector('#total_power10').innerText = total_power10;
      document.querySelector('#total_power11').innerText = total_power11;
      document.querySelector('#total_power12').innerText = total_power12;
      document.querySelector('#total_power13').innerText = total_power13;
      document.querySelector('#total_power14').innerText = total_power14;
      document.querySelector('#total_power15').innerText = total_power15;
      document.querySelector('#total_power_day1').innerText = total_power1_day;
      document.querySelector('#total_power_day2').innerText = total_power2_day;
      document.querySelector('#total_power_day3').innerText = total_power3_day;
      document.querySelector('#total_power_day4').innerText = total_power4_day;
      document.querySelector('#total_power_day5').innerText = total_power5_day;
      document.querySelector('#total_power_day6').innerText = total_power6_day;
      document.querySelector('#total_power_day7').innerText = total_power7_day;
      document.querySelector('#total_power_day8').innerText = total_power8_day;
      document.querySelector('#total_power_day9').innerText = total_power9_day;
      document.querySelector('#total_power_day10').innerText = total_power10_day;
      document.querySelector('#total_power_day11').innerText = total_power11_day;
      document.querySelector('#total_power_day12').innerText = total_power12_day;
      document.querySelector('#total_power_day13').innerText = total_power13_day;
      document.querySelector('#total_power_day14').innerText = total_power14_day;
      document.querySelector('#total_power_day15').innerText = total_power15_day;

      //calcular power per day
      let power_day =parseFloat(total_power1_day+total_power2_day+total_power3_day+total_power4_day+total_power5_day+total_power6_day+total_power7_day+total_power8_day+total_power9_day+total_power10_day+total_power11_day+total_power12_day+total_power13_day+total_power14_day+total_power15_day).toFixed(2);
      document.querySelector('#power_day').innerText = power_day;

      //calculate power per year
      let power_year =parseFloat(power_day*365).toFixed(2);
      document.querySelector('#power_year').innerText = power_year;

  })

});
  //Use API solar without refreshing the page
  const form = document.getElementById('form_solar');
  form.addEventListener('submit', function(event) {
    event.preventDefault();    // prevent page from refreshing
    const formData = new FormData(form);  
    fetch('/', {   
        method: 'POST',
        body: formData,
    });

      //Calculation of solar production
    let solar_data = document.querySelectorAll('#power_solar');

    const parsedData4 = []
    solar_data.forEach((item,index) => {
      parsedData4.push(parseFloat(item.dataset.name))
  });
    

  //Calculate total solar power
  let solar_sumpower = 0;
  for (var k = 0; k < parsedData4.length; k++)  //loops through the array 
  {
    solar_sumpower = solar_sumpower + parsedData4[k];

  }
    
  //Energy per day with loss of 14%
  solar_sumpower = parseFloat(solar_sumpower.toFixed(2));
  document.querySelector('#year_power').innerText = solar_sumpower;

  const ctx4 = document.getElementById('graph3').getContext('2d');
    
  //create a chart with solar production
  const chart4 = new Chart(ctx4, {

    data: {
      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DEC'],
      datasets: [{
        label: 'Solar Production',
        data: parsedData4,
        backgroundColor: 'rgba(86, 204, 157)',
        type: 'bar',
      },
      
    ]
    },

      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'SOLAR GENERATION',
            font: {
              size: 20,
              family: 'Helvetica Neue'
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month',

            }
      },
      y: {
          title: {
            display: true,
            text: 'PV Power (W)',
          }
    },
    }

      },


  })

  //calculate total savings
  })
  document.getElementById('saving').addEventListener('click', function(event) {
    event.preventDefault();
    let price = document.querySelector('#price').value;
    let total_solar = document.querySelector('#year_power').innerText;
    let total_wind = document.querySelector('#energy_year').innerText;
    let total_consumption = document.querySelector('#power_year').innerText;
    total_solar = total_solar || 0;
    total_wind = total_wind || 0;
    total_consumption = total_consumption || 0;

    let total_energy=parseFloat(total_wind)+parseFloat(total_solar);
    let percentage = parseFloat((total_energy/total_consumption)*100).toFixed(2);
    percentage = percentage || 0;
    let economic=parseFloat(total_energy*price).toFixed(2);
    document.querySelector('#total_solar').innerText = total_solar;
    document.querySelector('#total_wind').innerText = total_wind;
    document.querySelector('#total_energy').innerText = total_wind;
    document.querySelector('#total_consumption').innerText = total_consumption;
    document.querySelector('#economic').innerText = economic;
    document.querySelector('#percentage').innerText = percentage + "% per year";
  })
  
window.initMap = initMap;
initChart()
// initChart2()





