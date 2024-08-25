let map;
let currentLat;
let currentLng;
let marker;
let geocoder;
let responseDiv;
let chart3;
let chart4;

//power of turbine in watts
const turbine_powers = {
  wind13: {
    option_selected: [0, 0, 10, 40, 70, 150, 250, 375, 500, 600, 750, 850, 950, 1000, 700, 450, 300, 250, 250, 250, 250],
    model: "Bornay Wind 13+ 1kW"
  },
  enair30:{ 
    option_selected:[0, 0, 0, 10, 100, 300, 650, 1000, 1450, 1850, 2100, 2300, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500],
    model: "Enair 30 PRO 3kW"
  },
  wind25:{
    option_selected: [0, 0, 0, 50, 225, 450, 750, 1200, 1650, 2150, 2900, 3600, 4400, 5000, 4500, 3700, 2900, 2100, 1400, 1100, 1100],
    model: "Bornay Wind 25.3+ 5kW"
  },
  enair70: {
    option_selected: [0, 0, 0, 40, 155, 450, 925, 1400, 2100, 2800, 3400, 4000, 4150, 4300, 4375, 4450, 4475, 4500, 4475, 4450, 4425],
    model: "Enair 70 PRO 5.5kW"
  },
  atlas7:{ 
    option_selected: [0, 0, 13, 30, 256, 482, 752, 1176, 1694, 2765, 3710, 4372, 5327, 6153, 6762, 6942, 7032, 7032, 7032, 7032, 7032],
    model: "Atlas 7 7kW"
  },
  atlasx:{
    option_selected: [0, 0, 13, 30, 101, 256, 482, 617, 752, 1176, 1694, 2765, 3710, 4372, 5327, 6153, 6762, 6942, 7032, 7032, 7032],
    model: "Atlas X7 7kW"
  }
}

//function API google maps
function initMap() {
  currentLat = parseFloat(document.querySelector('#latitude').value)
  currentLng = parseFloat(document.querySelector('#longitude').value)
  currentLat = currentLat || 41.404056;
  currentLng = currentLng || 2.175012;
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
  let response = document.createElement("pre");
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
      document.querySelector('#latitude').value = results[0].geometry.location.lat();
      document.querySelector('#longitude').value = results[0].geometry.location.lng();
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

//Run once DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

  //Calculation of geolocation
  document.getElementById('location').addEventListener('click', function (event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(function (position) {
      document.querySelector('#latitude').value = position.coords.latitude;
      document.querySelector('#longitude').value = position.coords.longitude;
    })
  })

  //Calculate step1
  const form = document.getElementById('manual');
  let data;
  let data2;
  let speed;
  let direction;

  form.addEventListener('submit', function (event) {
    event.preventDefault();    // prevent page from refreshing
    const formData = new FormData(form);
    let latitude = document.getElementById('latitude').value;
    let longitude = document.getElementById('longitude').value;
    fetch('/', {
      method: 'POST',
      body: formData,
    }).then(response => response.json())
      .then(serverdata => {
        if (serverdata.error) {
          console.error(serverdata.error);
        } else {
          data = serverdata.weibull;
          data2 = serverdata.weibull_direction;
          speed = serverdata.speed;
          direction = serverdata.direction;
          document.querySelector('#speed').innerHTML = `<strong>Average speed (m/s): </strong>${speed}`;
          document.querySelector('#direction').innerHTML = `<strong>Average direction (º): </strong>${direction}`;
          document.querySelector('#latitude2').innerHTML = `<strong>Latitude: </strong>${latitude}`;
          document.querySelector('#longitude2').innerHTML = `<strong>Longitude: </strong>${longitude}`;
          document.querySelector('#latitude3').value = latitude;
          document.querySelector('#longitude3').value = longitude;
          const parsedData = []
          const labels = []

          //convert the data bar chart
          data.forEach((item, index) => {
            parsedData.push(parseFloat(item))
            labels.push(index)
          });

          //convert data wind rose chart
          const parsedData2 = []
          data2.forEach((item2) => {
            parsedData2.push(parseFloat(item2))
          });

          const ctx = document.getElementById('graph').getContext('2d');
          const ctx2 = document.getElementById('wind_rose').getContext('2d');
          new Chart(ctx, {
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

          new Chart(ctx2, {
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
      })
  });

  //Calculate power of turbine
  document.getElementById('turbine').addEventListener('click', function (event) {
    event.preventDefault();

    const parsedData3 = []
    const labels3 = []

    data.forEach((item, index) => {
      parsedData3.push(parseFloat(item))
      labels3.push(index)
    });

    var radios = document.getElementsByName('optionsRadios');
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        break;
      }
    }

    let option = String(radios[i].value);

    //select turbine 
    const option_selected = turbine_powers[option].option_selected;
    const model = turbine_powers[option].model; 
    
    //Calculate power average
    let power = [];
    let Sumpower = 0;
    for (var j = 0; j < data.length; j++)  //loops through the array 
    {
      power[j] = parseFloat(parsedData3[j]) * parseFloat(option_selected[j]);
      Sumpower = Sumpower + power[j];

    }

    //Energy per day with loss of 12%
    let energy_day = 0;
    let energy_year = 0;
    Sumpower = parseFloat(Sumpower.toFixed(2));
    energy_day = parseFloat((Sumpower * 24 * (1 - 0.12) / 1000).toFixed(2));
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
  document.getElementById('consumption').addEventListener('click', function (event) {
    event.preventDefault();
    let power_day = 0

    for (let index = 1; index <= 15; index++) {
      
      //get elements information
      const element = document.querySelector(`#input${index}`);
      const elementhr = document.querySelector(`#inputhr${index}`);
      const elementun = document.querySelector(`#inputun${index}`);
      
      //calculate total power
      const total_power = parseFloat(((element.value * elementun.value) / 1000).toFixed(2));

      //calculate total power per day
      const total_power_day = parseFloat((total_power * elementhr.value).toFixed(2));

      //result of total power in html text
      document.querySelector(`#total_power${index}`).innerText = total_power;
      document.querySelector(`#total_power_day${index}`).innerText = total_power_day;

      power_day += total_power_day
    }

    //calcular power per day
    document.querySelector('#power_day').innerText = power_day.toFixed(2);

    //calculate power per year
    let power_year = parseFloat(power_day * 365).toFixed(2);
    document.querySelector('#power_year').innerText = power_year;

  })

  //Use API solar without refreshing the page
  const form2 = document.getElementById('form_solar');
  form2.addEventListener('submit', function (event) {
    event.preventDefault();    // prevent page from refreshing
    const formData2 = new FormData(form2);
    let solar_production;
    let slope;
    let azimuth;
    fetch('/solar', {
      method: 'POST',
      body: formData2,
    }).then(response => response.json())
      .then(serverdata2 => {
        if (serverdata2.error) {
          console.error(serverdata2.error);
        } else {
          solar_production = serverdata2.solar_production;
          slope = serverdata2.slope;
          azimuth = serverdata2.azimuth;
          let solar_power = document.getElementById('solar_power').value;
          let loss = document.getElementById('loss').value;
          console.log(loss)
          document.querySelector('#solar_power2').innerHTML = `<strong>PV installed [kWp]: </strong>${solar_power}`;
          document.querySelector('#loss2').innerHTML = `<strong>System loss [%]: </strong>${loss}`;
          document.querySelector('#slope').innerText = slope;
          document.querySelector('#azimuth').innerText = azimuth;

          const parsedData4 = []
          solar_production.forEach((item) => {
            parsedData4.push(parseFloat(item))
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
          if (chart4) {
            chart4.destroy();
          }
          chart4 = new Chart(ctx4, {

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
        }
      })
  });






















  //create a chart with solar production





  //calculate total savings
  document.getElementById('saving').addEventListener('click', function (event) {
    event.preventDefault();
    let price = document.querySelector('#price').value;
    let total_solar = document.querySelector('#year_power').innerText;
    let total_wind = document.querySelector('#energy_year').innerText;
    let total_consumption = document.querySelector('#power_year').innerText;
    total_solar = total_solar || 0;
    total_wind = total_wind || 0;
    total_consumption = total_consumption || 0;

    let total_energy = parseFloat(total_wind) + parseFloat(total_solar);
    let percentage = parseFloat((total_energy / total_consumption) * 100).toFixed(2);
    percentage = percentage || 0;
    let economic = parseFloat(total_energy * price).toFixed(2);
    document.querySelector('#total_solar').innerText = total_solar;
    document.querySelector('#total_wind').innerText = total_wind;
    document.querySelector('#total_energy').innerText = total_wind;
    document.querySelector('#total_consumption').innerText = total_consumption;
    document.querySelector('#economic').innerText = economic;
    document.querySelector('#percentage').innerText = percentage + "% per year";
  })



});


window.initMap = initMap;






