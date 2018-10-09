/**
 * Main JS file for Top Changes page.
 */

/* global mapboxgl, $ */

// Dependencies
import { each, extend } from 'lodash';
import utils from './shared/utils.js';

// Mark page with note about development or staging
utils.environmentNoting();

// Mapbox access token
mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hhZG93ZmxhcmUiLCJhIjoiS3pwY1JTMCJ9.pTSXx_LFgR3XBpCNNxWPKA';

// Data layer to manipulate
const dataLayer = 'changed-grouped-atu4km';

// Use fresh map, TODO: remove later
const fresh = true;

// Style definitions
let mapDefinitions = {
  'map-r1-to-interior-1': {
    styles: {
      'fill-opacity': [
        'case',
        [
          'all',
          ['==', ['get', 'built_form'], 'Interior 1'],
          [
            'any',
            ['==', ['get', 'zone_code'], 'R1'],
            ['==', ['get', 'zone_code'], 'R1A']
          ]
        ],
        1,
        0.1
      ]
    }
  },
  'map-r1-to-interior-2': {
    styles: {
      'fill-opacity': [
        'case',
        [
          'all',
          ['==', ['get', 'built_form'], 'Interior 2'],
          [
            'any',
            ['==', ['get', 'zone_code'], 'R1'],
            ['==', ['get', 'zone_code'], 'R1A']
          ]
        ],
        1,
        0.1
      ]
    }
  },
  'map-r1-to-corridor-4': {
    mapOptions: {
      pitch: 80,
      bearing: -15,
      center: [-93.263385, 44.914403],
      zoom: 13
    },
    styles: {
      'fill-opacity': [
        'case',
        [
          'all',
          ['==', ['get', 'built_form'], 'Corridor 4'],
          [
            'any',
            ['==', ['get', 'zone_code'], 'R1'],
            ['==', ['get', 'zone_code'], 'R1A']
          ]
        ],
        1,
        0.1
      ]
    }
  },
  'map-select': {
    select: true
  }
};

// Make maps
each(mapDefinitions, (def, id) => {
  def.map = new mapboxgl.Map(
    extend(
      {
        container: id,
        style: `mapbox://styles/shadowflare/cjn24l6q300n12rpojx7vz1j7${
          fresh ? '?fresh=true' : ''
        }`,
        attributionControl: false,
        scrollZoom: false
      },
      def.mapOptions ? def.mapOptions : {}
    )
  );

  // Add controls
  def.map.addControl(new mapboxgl.NavigationControl());

  // When ready
  def.map.on('load', () => {
    // Do styles
    if (def.styles) {
      each(def.styles, (expression, prop) => {
        def.map.setPaintProperty(dataLayer, prop, expression);
      });
    }

    // Create a popup
    def.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    // On mouse over
    def.map.on('mouseover', dataLayer, function(e) {
      // Change the cursor style as a UI indicator.
      def.map.getCanvas().style.cursor = 'pointer';

      var description = `
        ${e.features[0].properties.zone_code} ->
        ${e.features[0].properties.built_form}
      `;

      // Populate the popup and set its coordinates
      // based on the feature found.
      def.popup
        .setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(def.map);
    });

    def.map.on('mouseleave', dataLayer, function() {
      def.map.getCanvas().style.cursor = '';
      def.popup.remove();
    });

    // Selectable
    if (def.select) {
      $('#select-built-form, #select-zoning').on('change', () => {
        let zoning = $('#select-zoning').val();
        let built = $('#select-built-form').val();

        if (!zoning && !built) {
          def.map.setPaintProperty(dataLayer, 'fill-opacity', 1);
          return;
        }

        let all = ['all'];
        if (zoning) {
          all.push(['==', ['get', 'zone_code'], zoning]);
        }
        if (built) {
          all.push(['==', ['get', 'built_form'], built]);
        }
        def.map.setPaintProperty(dataLayer, 'fill-opacity', [
          'case',
          all,
          1,
          0.1
        ]);
      });
    }
  });
});
