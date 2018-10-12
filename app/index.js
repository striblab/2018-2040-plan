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
import Popover from './shared/popover.js';

// Mark page with note about development or staging
utils.environmentNoting();

// Mapbox access token
mapboxgl.accessToken = mapConfig.accessToken;

// Geocoding event issue
// See: https://github.com/mapbox/mapbox-gl-geocoder/issues/99
let lastGeocode;

// Create map
const map = new mapboxgl.Map({
  container: 'explorable-map',
  style: mapConfig.style,
  attributionControl: false,
  scrollZoom: false
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
  console.log('a');

  // Create popover
  let popover = new Popover({ map });
  map.on('click', mapConfig.dataLayer, e => {
    if (!e || !e.features || !e.features.length) {
      marker.hide();
      popover.close();
      return;
    }

    marker.moveTo(e.lngLat);
    popover.open(e);
  });

  // Mouseover events
  map.on('mouseenter', mapConfig.dataLayer, () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', mapConfig.dataLayer, () => {
    map.getCanvas().style.cursor = '';
  });

  // Handle geocoder results
  geocoder.on('result', ({ result }) => {
    // Don't do anything if same geocode
    if (result.center.toString() === lastGeocode) {
      return;
    }

    // Move marker
    marker.moveTo(result.geometry.coordinates);

    // TODO: This doesn't seem to work.  It doesn't work on
    // first geocode, then gets wrong point on next one.
    //
    // // See if we have data
    // let features = map.queryRenderedFeatures(result.geometry.coordinates, {
    //   layers: [mapConfig.dataLayer]
    // });
    // console.log(features);
    // if (features && features.length) {
    //   popover.open({ features });
    // }
    // else {
    //   popover.close();
    // }

    // Mark last geocode
    lastGeocode = result.center.toString();
  });
});

// Handle zoning definitions
definitions();
