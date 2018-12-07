/**
 * Pop over for map
 */

// Dependencies
import { keyBy } from 'lodash';
import zoningDefinitions from '../../assets/data/zoning-definitions.json';
import customjQuery from 'jquery';

// For some reason jQuery is not loading on the page in FF
let $ = window.$;
if (!$) {
  $ = customjQuery;
}

// Keyed definitions
const keyedDefinitions = keyBy(zoningDefinitions, d => `${d.Code}-${d.Type}`);

// Publish location
const publishLocation =
  'http://static.startribune.com/news/projects/all/2018-2040-plan/';

// Main class
class Popover {
  constructor({ map }) {
    this.map = map;
    $(this.map._container).append(this.layout());
  }

  layout() {
    this.$container = $(`
      <div class="popover">
        <button type="button" class="button-link dark popover-close">x</button>
        <div class="popover-content"></div>
      </div>
    `);

    this.$content = this.$container.find('.popover-content');

    this.$close = this.$container.find('.popover-close');
    this.$close.on('click', () => {
      this.close();
    });

    return this.$container;
  }

  content(e) {
    if (!e || !e.features || !e.features[0]) {
      return '';
    }

    let zoneDef =
      keyedDefinitions[`${e.features[0].properties.zone_code}-zoning`];
    let builtDef =
      keyedDefinitions[
        `${e.features[0].properties.built_form}-2040-built-form`
      ];
    let landDef =
      keyedDefinitions[`${e.features[0].properties.land_use}-2040-land-use`];
    let hasImage = builtDef['Image Render'] || builtDef['Image Elevation'];

    return `
      <div class="row">
        <div class="col ${
  hasImage ? 'col-33' : 'col-50'
} col-md-100 zoning-column">
          <div class="popover-label">
            Current zoning:
            <strong>
              ${e.features[0].properties.zone_code}:
              ${zoneDef.Label}
            </strong>
          </div>

          <div class="popover-section">
            ${zoneDef['Strib Description'] || zoneDef['Description']}
          </div>
        </div>

        <div class="col ${
  hasImage ? 'col-33' : 'col-50'
} col-md-100 zoning-column">
          <div class="popover-label">
            Proposed built form:
            <strong>
              ${builtDef.Label}
            </strong>
          </div>

          <div class="popover-section">
            ${builtDef['Strib Description'] || builtDef['Description']}
          </div>


          <div class="popover-label land-use-under-built-form">
            Proposed land use:
            <strong>
              ${landDef.Label}
            </strong>
          </div>
        </div>

        <div class="col ${
  hasImage ? 'col-33' : 'col-0'
} col-md-100 image-column">
          ${
  builtDef['Image Render']
    ? '<img class="image-render" src="' +
                publishLocation +
                'assets/images/built-forms/' +
                builtDef['Image Render'] +
                '" alt="Rendering of ' +
                builtDef.Label +
                '">'
    : ''
}

          ${
  builtDef['Image Elevation']
    ? '<img class="image-elevation" src="' +
                publishLocation +
                'assets/images/built-forms/' +
                builtDef['Image Elevation'] +
                '" alt="Elevation rendering of ' +
                builtDef.Label +
                '">'
    : ''
}
        </div>

        <div class="col ${
  hasImage ? 'col-33' : 'col-50'
} col-md-100 land-use-column">
          <div class="popover-label">
            Proposed land use:
            <strong>
              ${landDef.Label}
            </strong>
          </div>

          <div class="popover-section">
            ${landDef['Strib Description'] || landDef['Description']}
          </div>
        </div>
      </div>
    `;
  }

  open(e) {
    this.$content.html(this.content(e));
    this.$container.slideDown('fast', () => {
      this.$container.addClass('active');
    });
  }

  close() {
    this.$container.slideUp('fast', () => {
      this.$container.removeClass('active');
    });
  }
}

export default Popover;
