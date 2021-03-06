/**
 * Zoning definitions JS
 */

// Dependencies
import { maxBy } from 'lodash';
import customjQuery from 'jquery';

// For some reason jQuery is not loading on the page in FF
let $ = window.$;
if (!$) {
  $ = customjQuery;
}

// Main export
export default () => {
  // Get heights to align
  $(window).on('load', () => {
    $('.definitions').each((i, el) => {
      let maxHeight = $(
        maxBy($(el).find('.definition'), d => {
          return $(d).height();
        })
      ).height();

      $(el)
        .find('.definition-wrapper')
        .css('height', `${maxHeight}px`);
    });
  });

  // // Definitions
  // let $zoningDefSection = $('.zoning-definitions');
  // if (!$zoningDefSection.length) {
  //   return;
  // }
  // $zoningDefSection.addClass('with-js');

  // // Each definition
  // let $definitions = $('.definition');

  // // On hover
  // $definitions.on('mouseenter', function() {
  //   let $d = $(this);
  //   let pos = $d.position();
  //   let $p = $d.offsetParent();
  //   let orient = pos.left >= $p.innerWidth() / 2 - 3 ? 'right' : 'left';

  //   $d.addClass(orient === 'right' ? 'active active-right' : 'active');
  // });

  // $definitions.on('mouseleave', function() {
  //   let $d = $(this);
  //   $d.removeClass('active').removeClass('active-right');
  // });
};
