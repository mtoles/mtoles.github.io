var geocoder;
var map;

function infoWindowDiv(place) {
    var contentString = `<div style="white-space: pre-line;">
      <strong>${place.Place} (${place.ID})</strong>
      
      <strong>Owner</strong>: ${place.owner}
      <strong>Score</strong>: ${place.score}

      <strong>${place.Title}</strong>
      ${place.Activity}

      <strong>Score</strong>
      ${place.Score} - ${place.Winner}

      <strong>Fine Print</strong>
      ${place["Fine Print"]}

      <strong>Play as</strong>
      ${place["Team/Solo"]}

      <strong>Category</strong>
      ${place.Category}

      ${place["Flavor Text"]}
    </div>
  `;
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

    // Return color as a string in RGB format
    return `rgb(${Math.abs(r)}, ${Math.abs(g)}, ${Math.abs(b)})`;
}

function initialize() {
    var mapDiv = document.getElementById("map_canvas");
    mapDiv.style.position = 'absolute';
    mapDiv.style.left = '0px';
    mapDiv.style.top = '0px';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';

    map = new google.maps.Map(
        mapDiv, {
            center: new google.maps.LatLng(47.609952, -122.329062),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

    // var request = {
    //     placeId: 'ChIJOwE7_GTtwokRFq0uOwLSE9g'
    // };
    fetch("https://128.59.18.156:55244/places").then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        var infowindow = new google.maps.InfoWindow({
            content: "Loading..."
        });
        data.forEach( place => {
            if (place.owner == null) {
                var color = "rgb(111,111,111)";
            }
            else
                var color = stringToRandomColor(place.owner);
            
            var marker = new google.maps.Marker({
                map: map,
                // position: place.geometry
                position: new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng),
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: color,
                    fillOpacity: 0.8,
                    strokeColor: "black",
                    strokeWeight: 3
                  }
            });
            
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(infoWindowDiv(place));
                infowindow.open(map, this);
            });

        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
}

