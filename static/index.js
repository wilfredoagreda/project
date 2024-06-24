let map;
let marker;
let geocoder;
let responseDiv;
let response;
let currentLat;
let currentLng;

function initMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
    currentLat = parseFloat(position.coords.latitude.toFixed(3))
    currentLng = parseFloat(position.coords.longitude.toFixed(3))
    document.querySelector('#latitude').value = currentLat;
    document.querySelector('#longitude').value = currentLng;
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

window.initMap = initMap;