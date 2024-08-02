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
  document.querySelector('.btn.btn-primary').addEventListener('click', function(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
      document.querySelector('#latitude').value = position.coords.latitude;
      document.querySelector('#longitude').value = position.coords.longitude;

    })
  })


});

function initMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
    currentLat = parseFloat(position.coords.latitude.toFixed(6))
    currentLng = parseFloat(position.coords.longitude.toFixed(6))
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
  });
  
}

function clear() {
  marker.setMap(null);
  responseDiv.style.display = "none";
}

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

function initChart() {
  let data = document.querySelectorAll('#weibull');
  let data2 = document.querySelectorAll('#weibull_direction');
  const parsedData = []
  const labels = []
  data.forEach((item,index) => {
    parsedData.push(parseFloat(item.dataset.name))
    labels.push(index)

  });
  const parsedData2 = []
  data2.forEach((item2) => {
    parsedData2.push(parseFloat(item2.dataset.name))
  });
  
  // console.log(parsedData2)

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

  //Calculation of geolocation
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
  
      // document.querySelector('#result2').innerHTML = option_selected;
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
        document.querySelector('#energy_avg').innerText = Sumpower + " W";
        document.querySelector('#energy_day').innerText = energy_day + " kW";
        document.querySelector('#energy_year').innerText = energy_year + " kW";
        document.querySelector('#model').innerText = model;
  
        // console.log(Sumpower);
  

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
});





    // document.querySelector('#result').innerHTML = option;
    // document.querySelector('#result').innerHTML = option;


window.initMap = initMap;
initChart()
// initChart2()





