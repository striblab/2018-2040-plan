/**
 * Popup content function
 */

// Dependencies
import { keyBy } from 'lodash';
import mapConfig from './map-config.js';
import zoningDefinitions from '../../assets/data/zoning-definitions.json';

// Keyed definitions
const keyedDefinitions = keyBy(zoningDefinitions, d => `${d.Code}-${d.Type}`);

// Main function
export default e => {
  if (!e || !e.features || !e.features[0]) {
    return '';
  }

  let zoneDef =
    keyedDefinitions[`${e.features[0].properties.zone_code}-zoning`];
  let builtDef =
    keyedDefinitions[`${e.features[0].properties.built_form}-2040-built-form`];

  return `
    <div class="popup-content">
      <div class="popup-label">
        From
        <strong>
          ${e.features[0].properties.zone_code}:
          ${zoneDef.Label}
        </strong>
      </div>

      <div class="popup-section">
        ${zoneDef['Strib Description'] || zoneDef['Description']}
      </div>

      <div class="popup-label">
        To
        <strong>
          ${builtDef.Label}
        </strong>
      </div>

      <div class="popup-section">
        ${builtDef['Strib Description'] || builtDef['Description']}
      </div>

      ${
  builtDef['Image Render']
    ? '<img class="image-render" src="./assets/images/built-forms/' +
            builtDef['Image Render'] +
            '" alt="Rendering of ' +
            builtDef.Label +
            '">'
    : ''
}
    </div>
  `;
};
