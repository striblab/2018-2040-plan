/**
 * Main JS file for Top Changes page.
 */

/* global mapboxgl, $ */

// Dependencies
import { each, extend } from 'lodash';
import utils from './shared/utils.js';
import mapConfig from './shared/map-config.js';
import popupContent from './shared/popup.js';
import definitions from './shared/zoning-definitions.js';

// Mark page with note about development or staging
utils.environmentNoting();

// Mapbox access token
mapboxgl.accessToken = mapConfig.accessToken;

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
        style: mapConfig.style,
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
        def.map.setPaintProperty(mapConfig.dataLayer, prop, expression);
      });
    }

    // Create a popup
    def.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    // Popup events
    def.map.on('mousemove', mapConfig.dataLayer, e => {
      if (e && e.features && e.features[0]) {
        def.map.getCanvas().style.cursor = 'pointer';
        def.popup
          .setLngLat(e.lngLat)
          .setHTML(popupContent(e))
          .addTo(def.map);
      }
      else {
        def.map.getCanvas().style.cursor = '';
        def.popup.setHTML('').remove();
      }
    });
    def.map.on('mouseout', mapConfig.dataLayer, e => {
      def.map.getCanvas().style.cursor = '';
      def.popup.setHTML('').remove();
    });

    // Selectable
    if (def.select) {
      $('#select-built-form, #select-zoning').on('change', () => {
        let zoning = $('#select-zoning').val();
        let built = $('#select-built-form').val();

        if (!zoning && !built) {
          def.map.setPaintProperty(mapConfig.dataLayer, 'fill-opacity', 1);
          return;
        }

        let all = ['all'];
        if (zoning) {
          all.push(['==', ['get', 'zone_code'], zoning]);
        }
        if (built) {
          all.push(['==', ['get', 'built_form'], built]);
        }
        def.map.setPaintProperty(mapConfig.dataLayer, 'fill-opacity', [
          'case',
          all,
          1,
          0.1
        ]);
      });
    }
  });
});

// Handle zoning definitions
definitions();
