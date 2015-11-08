(function(L, undefined) {

  L.mapbox.accessToken="pk.eyJ1IjoiaW5mb2FtYXpvbmlhIiwiYSI6InItajRmMGsifQ.JnRnLDiUXSEpgn7bPDzp7g"

  module.exports = function(app) {

    app.directive('map', [
      function() {
        return {
          restrict: 'E',
          link: function(scope, element, attrs) {

            angular.element(element)
              .append('<div id="' + attrs.id + '"></div>')
              .attr('id', '');

            var map = L.map(attrs.id, {
              center: [-9.107747, -58.103348],
              zoom: 5
            });

            var baseLayers = {
              baseLayer: L.mapbox.tileLayer('infoamazonia.8d20fc32'),
              baltimetria: L.mapbox.tileLayer('infoamazonia.naturalEarth_baltimetria'),
              rivers: L.mapbox.tileLayer('infoamazonia.rivers'),
              treecover: L.mapbox.tileLayer('infoamazonia.4rbe1sxe'),
              streets: L.mapbox.tileLayer('infoamazonia.osm-brasil')
            };

            for(var key in baseLayers) {
              map.addLayer(baseLayers[key]);
            }

            var overlayLayers = {
              'Unidades de Conservação': L.mapbox.tileLayer('infoamazonia.ojdsix43'),
              'Terras indígenas': L.mapbox.tileLayer('infoamazonia.qwbaban8'),
              'Desmatamento': L.mapbox.tileLayer('infoamazonia.9by7k878')
            };

            L.control.layers({}, overlayLayers).addTo(map);

          }
        }
      }
    ])

  };

})(window.L);
