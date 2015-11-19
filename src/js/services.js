(function(vindig, L, undefined) {

  module.exports = function(app) {

    // Proper serialization
    app.config(['$httpProvider',
      function($httpProvider) {
        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
      }
    ]);

    app.factory('Vindig', [
      '$http',
      function($http) {
        return {
          maps: function(params, filter) {
            params = params || {};
            params = _.extend({
              type: 'map'
            }, params);

            filter = filter || {};
            filter = _.extend({
              posts_per_page: 50
            }, filter);

            params.filter = filter;

            return $http({
              method: 'GET',
              url: vindig.api + 'posts',
              params: params
            });
          },
          cases: function(params, filter) {
            params = params || {};
            params = _.extend({
              type: 'case'
            }, params);

            filter = filter || {};
            filter = _.extend({
              posts_per_page: 80
            }, filter);

            params.filter = filter;

            return $http({
              method: 'GET',
              url: vindig.api + 'posts',
              params: params
            });
          },
          dossiers: function(params, filter) {
            params = params || {};
            params = _.extend({
              type: 'dossier'
            }, params);

            filter = filter || {};
            filter = _.extend({
              posts_per_page: 50
            }, filter);

            params.filter = filter;

            return $http({
              method: 'GET',
              url: vindig.api + 'posts',
              params: params
            });
          },
          getLayer: function(layerObj, map) {
            var layer = {
              name: layerObj.title
            };
            if(layerObj.type == 'mapbox') {
              var tileLayer = L.mapbox.tileLayer(layerObj.mapbox_id);
              var gridLayer = L.mapbox.gridLayer(layerObj.mapbox_id);
              layer.layer = L.layerGroup([tileLayer,gridLayer]);
              map.addControl(L.mapbox.gridControl(gridLayer));
            } else if(layerObj.type == 'tilelayer') {
              layer.layer = L.tileLayer(layerObj.url);
            }
            return layer;
          }
        }
      }
    ])

  }

})(window.vindig, window.L);
