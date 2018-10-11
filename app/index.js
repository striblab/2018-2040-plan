/**
 * Main JS file for project.
 */

/* global mapboxgl, MapboxGeocoder, $ */

// Dependencies
import utils from './shared/utils.js';
import mapConfig from './shared/map-config.js';
import definitions from './shared/zoning-definitions.js';
import popupContent from './shared/popup.js';
import MapMarker from './shared/marker.js';

// Mark page with note about development or staging
utils.environmentNoting();

// Mapbox access token
mapboxgl.accessToken = mapConfig.accessToken;

// Create map
const map = new mapboxgl.Map({
  container: 'explorable-map',
  style: mapConfig.style,
  attributionControl: false
  //scrollZoom: false
});

// Add controls
map.addControl(new mapboxgl.NavigationControl());

// Geocoder container
let $geocoderContainer = $('.address-search');

// Geocoding control
let geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  country: 'us',
  bbox: [-93.351288, 44.874126, -93.16143, 45.060676]
});
$geocoderContainer.append(geocoder.onAdd(map));

// Marker
let marker = new MapMarker({ map });

// When ready
map.on('load', () => {
  // Create a popup
  let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // Popup events
  map.on('mousemove', mapConfig.dataLayer, e => {
    if (e && e.features && e.features[0]) {
      map.getCanvas().style.cursor = 'pointer';
      popup
        .setLngLat(e.lngLat)
        .setHTML(popupContent(e))
        .addTo(map);
    }
    else {
      map.getCanvas().style.cursor = '';
      popup.setHTML('').remove();
    }
  });
  map.on('mouseout', mapConfig.dataLayer, e => {
    map.getCanvas().style.cursor = '';
    popup.setHTML('').remove();
  });

  // Handle geocoder results
  geocoder.on('result', ({ result }) => {
    marker.moveTo(result);
  });
});

// Handle zoning definitions
definitions();
