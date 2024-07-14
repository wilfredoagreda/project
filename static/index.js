let map;
let marker;
let geocoder;
let responseDiv;
let response;
let currentLat;
let currentLng;

//Run once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {

  //Calculation of geolocation
  document.querySelector('.btn.btn-primary').addEventListener('click', function(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
      document.querySelector('#latitude').value = position.coords.latitude;
      document.querySelector('#longitude').value = position.coords.longitude;
    });
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
        xAxes: [{
          display: false,
          barPercentage: 1.3,
          ticks: {
            max: 3,
          }
        }, {
          display: true,
          ticks: {
            autoSkip: false,
            max: 4,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
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

window.initMap = initMap;
initChart()

