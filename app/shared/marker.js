/**
 * Simple class to handle marker
 */

/* global $, mapboxgl */

// Main class
class Marker {
  constructor({ map }) {
    this.map = map;
    this.$el = $('<div>').addClass('simple-marker');
    this.el = this.$el[0];
    this.marker = new mapboxgl.Marker(this.el);
  }

  moveTo(feature) {
    this.marker.setLngLat(feature.geometry.coordinates).addTo(this.map);
  }

  hide() {
    this.marker.remove(this.map);
  }
}

export default Marker;
