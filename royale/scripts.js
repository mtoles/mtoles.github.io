var geocoder;
var map;

function infoWindowDiv(place) {
    var contentString = `<div style="white-space: pre-line; font-size: 25px; padding-left: 20px; padding-right: 20px; padding-bottom: 20px; overflow-wrap: break-word;">
      <strong>${place.Place} (${place.ID})</strong>
      
      <strong>Owner</strong>: ${place.owner}
      <strong>Score</strong>: ${place.score}

      <strong>${place.Title}</strong>
      ${place.Activity}

      <strong>Score</strong>
      ${place.Score} - ${place.Winner}
    </div>`;
    return contentString;
}

function stringToRandomColor(inputString) {
    // Generate a hash value from the input string
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to a valid RGB color
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;
    return [Math.abs(r), Math.abs(g), Math.abs(b)];
}

async function initialize() {
    
    var mapDiv = document.getElementById("map_canvas");
    mapDiv.style.position = 'absolute';
    mapDiv.style.left = '0px';
    mapDiv.style.top = '0px';
    mapDiv.style.width = '100%';
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    mapDiv.style.height = '100%';

    map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(40.740111, -73.992315),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapId: "MY_MAP_ID"
    });

    // Create a single global info panel for all markers
    const infoPanel = document.createElement("div");
    infoPanel.id = "info-panel";
    infoPanel.style.position = "absolute";
    infoPanel.style.bottom = "0";
    infoPanel.style.left = "0";
    infoPanel.style.width = "100%";
    infoPanel.style.height = "33%";
    infoPanel.style.backgroundColor = "white";
    infoPanel.style.zIndex = "1000";
    infoPanel.style.overflowY = "auto";
    infoPanel.style.display = "none"; // hidden by default
    infoPanel.style.padding = "20px";

    // Create the close button once
    const closeButton = document.createElement("div");
    closeButton.innerHTML = "&#x2715;"; // X symbol
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "60px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "50px";
    closeButton.style.fontWeight = "bold";
    closeButton.addEventListener("click", () => {
        infoPanel.style.display = "none";
    });

    infoPanel.appendChild(closeButton);
    mapDiv.appendChild(infoPanel);

    fetch("https://128.59.18.156:55244/places")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(place => {
                var color_hex = place.owner == null ? [111, 111, 111] : stringToRandomColor(place.owner);
                var color = "rgb(" + color_hex[0] + "," + color_hex[1] + "," + color_hex[2] + ")";
                var bg_color_hex = [
                    Math.max(0, color_hex[0] - 50),
                    Math.max(0, color_hex[1] - 50),
                    Math.max(0, color_hex[2] - 50)
                ];
                var bg_color = "rgb(" + bg_color_hex[0] + "," + bg_color_hex[1] + "," + bg_color_hex[2] + ")";

                const icon = document.createElement("div");
                icon.innerHTML = '<i class="fa fa-pizza-slice fa-lg"></i>';

                const faPin = new PinElement({
                    glyph: icon,
                    glyphColor: color,
                    background: bg_color,
                    borderColor: color,
                });

                // var marker = new google.maps.marker.AdvancedMarkerElement({
                // var marker = new AdvancedMarkerElement({
                //     map: map,
                //     position: new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng),
                //     content: faPin.element,
                    
                // });
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                    
                  });

                google.maps.event.addListener(marker, 'click', function () {
                    // Clear previous content and re-add the close button
                    infoPanel.innerHTML = "";
                    infoPanel.appendChild(closeButton);
                    const contentDiv = document.createElement("div");
                    contentDiv.innerHTML = infoWindowDiv(place);
                    infoPanel.appendChild(contentDiv);
                    infoPanel.style.display = "block";
                });
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
