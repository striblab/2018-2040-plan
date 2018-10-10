/**
 * Popup content function
 */

// Dependencies
import { keyBy } from 'lodash';
import mapConfig from './map-config.js';
import definitions from '../../sources/zoning_definitions.json';

// Keyed definitions
const keyedDefinitions = keyBy(definitions, d => `${d.code}-${d.type}`);

// Main function
export default e => {
  if (!e || !e.features || !e.features[0]) {
    return '';
  }

  return `
    <div class="popup-content">
      <div class="popup-label">
        <strong>${e.features[0].properties.zone_code}</strong>
        to
        <strong>${e.features[0].properties.built_form}</strong>
      </div>

      <div class="popup-section">
        <strong>${e.features[0].properties.zone_code}</strong><br>
        ${
  keyedDefinitions[e.features[0].properties.zone_code + '-zoning']
    .description
}
      </div>

      <div class="popup-section">
        <strong>${e.features[0].properties.built_form}</strong><br>
        ${
  keyedDefinitions[
    e.features[0].properties.built_form + '-2040-built-form'
  ].description
}
      </div>
    </div>
  `;
};
