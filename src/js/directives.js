(function(vindig, L, undefined) {

  L.mapbox.accessToken = "pk.eyJ1IjoiaW5mb2FtYXpvbmlhIiwiYSI6InItajRmMGsifQ.JnRnLDiUXSEpgn7bPDzp7g"

  module.exports = function(app) {

    app.directive('map', [
      'Vindig',
      function(Vindig) {
        return {
          restrict: 'E',
          scope: {
            'markers': '='
          },
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
              baltimetria:  L.mapbox.tileLayer('infoamazonia.naturalEarth_baltimetria'),
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

            var markerLayer = L.markerClusterGroup();

            markerLayer.addTo(map);

            var markers = [];
            scope.$watch('markers', function(posts) {
              markers = [];
              for(var key in posts) {
                var post = posts[key];
                markers[key] = L.marker([post.lat,post.lng]);
              }
              for(var key in markers) {
                markers[key].addTo(markerLayer);
              }
            }, true);

          }
        }
      }
    ])

  };

})(window.vindig, window.L);
