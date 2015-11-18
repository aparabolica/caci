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

            Vindig.maps().then(function(data) {
              var mapData = data.data[0];

              console.log(mapData);

              angular.element(element)
                .append('<div id="' + attrs.id + '"></div>')
                .attr('id', '');

              var map = L.map(attrs.id, {
                center: mapData.center,
                zoom: mapData.zoom,
                minZoom: parseInt(mapData.min_zoom),
                maxZoom: parseInt(mapData.max_zoom)
              });

              var fixed = [];
              var swapable = [];
              var switchable = [];

              if(mapData.base_layer.url) {
                fixed.push(mapData.base_layer);
              }

              _.each(mapData.layers, function(layer) {
                if(layer.filtering == 'fixed') {
                  fixed.push(Vindig.getLayer(layer));
                } else if(layer.filtering == 'swap') {
                  swapable.push(Vindig.getLayer(layer));
                } else if(layer.filtering == 'switch') {
                  switchable.push(Vindig.getLayer(layer));
                }
              });

              _.each(fixed, function(layer) {
                map.addLayer(layer.layer);
              });

              var swapLayers = {};

              _.each(swapable, function(layer) {
                swapLayers[layer.name] = layer.layer;
              });

              var overlayLayers = {};

              _.each(switchable, function(layer) {
                overlayLayers[layer.name] = layer.layer;
              });
              
              L.control.layers(swapLayers, overlayLayers).addTo(map);

              var markerLayer = L.markerClusterGroup({
                maxClusterRadius: 40
              });

              markerLayer.addTo(map);

              var markers = [];
              scope.$watch('markers', _.debounce(function(posts) {
                for(var key in markers) {
                  markerLayer.removeLayer(markers[key]);
                }
                markers = [];
                for(var key in posts) {
                  var post = posts[key];
                  markers[key] = L.marker([post.lat,post.lng]);
                }
                for(var key in markers) {
                  markers[key].addTo(markerLayer);
                }
              }, 300), true);

            });

          }
        }
      }
    ])

  };

})(window.vindig, window.L);
