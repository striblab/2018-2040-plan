/**
 * Simple class to handle marker
 */

/* global mapboxgl */

// Dependencies
import customjQuery from 'jquery';

// For some reason jQuery is not loading on the page in FF
let $ = window.$;
if (!$) {
  $ = customjQuery;
}

// Main class
class Marker {
  constructor({ map }) {
    this.map = map;
    this.$el = $('<div>').addClass('simple-marker');
    this.el = this.$el[0];
    this.marker = new mapboxgl.Marker(this.el);
  }

  moveTo(lngLat) {
    this.marker.setLngLat(lngLat).addTo(this.map);
  }

  hide() {
    this.marker.remove(this.map);
  }
}

export default Marker;
