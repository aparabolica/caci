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
          pages: function(params, filter) {
            params = params || {};
            params = _.extend({
              type: 'page'
            }, params);

            filter = filter || {};
            filter = _.extend({
              posts_per_page: 50,
              orderby: 'menu_order',
              order: 'ASC'
            }, filter);

            params.filter = filter;

            return $http({
              method: 'GET',
              url: vindig.api + '/posts',
              params: params
            });
          },
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
              url: vindig.api + '/posts',
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
              posts_per_page: 80,
              without_map_query: 1
            }, filter);

            params.filter = filter;

            return $http({
              method: 'GET',
              url: vindig.api + '/posts',
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
              posts_per_page: 50,
              without_map_query: 1
            }, filter);

            params.filter = filter;

            return $http({
              method: 'GET',
              url: vindig.api + '/posts',
              params: params
            });
          },
          getLayer: function(layerObj, map) {
            var layer = {
              name: layerObj.title || ''
            };
            if(layerObj.type == 'mapbox') {
              var tileLayer = L.mapbox.tileLayer(layerObj.mapbox_id);
              var gridLayer = L.mapbox.gridLayer(layerObj.mapbox_id);
              layer.layer = L.layerGroup([tileLayer,gridLayer]);
              layer.control = L.mapbox.gridControl(gridLayer);
            } else if(layerObj.type == 'tilelayer') {
              layer.layer = L.tileLayer(layerObj.tile_url);
            }

            if(layerObj.legend) {
              layer.legend = layerObj.legend;
            }

            if(layer.layer) {
              if(layerObj.zIndex) {
                layer.layer.setZIndex(layerObj.zIndex);
              }
              layer.layer._vindig_id = layerObj.ID;
            }
            return layer;
          },
          getPost: function(id) {
            return $http.get(vindig.api + '/posts/' + id);
          },
          getUniq: function(list, param, uniqParam) {
            var vals = [];
            _.each(list, function(item) {
              if(item[param]) {
                if(angular.isArray(item[param])) {
                  if(item[param].length)
                    vals = vals.concat(item[param]);
                } else
                  vals.push(item[param]);
              }
            });
            if(vals.length) {
              var uniq = _.uniq(vals, function(item, key) {
                if(typeof uniqParam !== 'undefined' && item[uniqParam]) {
                  return item[uniqParam];
                } else {
                  return item;
                }
              });
              return _.compact(uniq);
            } else {
              return [];
            }
          }
        }
      }
    ])

  }

})(window.vindig, window.L);
