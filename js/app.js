(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(undefined) {

  module.exports = function(app) {

    app.controller('MainCtrl', [
      '$scope',
      'Vindig',
      function($scope, Vindig) {
        $scope.init = function() {
          $scope.initialized = true;
        }
        Vindig.cases().then(function(data) {
          $scope.casos = data.data;
          var totalPages = data.headers('X-WP-TotalPages');
          console.log($scope.casos[0]);
          for(var i = 2; i <= totalPages; i++) {
            Vindig.cases({page: i}).then(function(data) {
              $scope.casos = $scope.casos.concat(data.data);
            });
          }
        });
      }
    ]);

    app.controller('HomeCtrl', [
      '$scope',
      function($scope) {
      }
    ])

  };

})();

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function(undefined) {

  module.exports = function(app) {

    app.filter('casoName', [
      function() {
        return function(input) {
          var name = '';
          if(input) {
            if(input.nome) {
              name += input.nome;
              if(input.apelido) {
                name += ' (' + input.apelido + ')';
              }
            } else if(input.apelido) {
              name += input.apelido;
            } else {
              name += 'Não identificado';
            }
            if(input.idade) {
              name += ', ' + input.idade + ' anos';
            }
          }
          return name;
        }
      }
    ]);

    app.filter('casoDate', [
      '$sce',
      function($sce) {
        return function(input) {
          var date = '';
          if(input.ano) {
            date = '<span class="ano">' + input.ano + '</span>';
          }
          if(input.mes) {
            date += '<span class="mes">/' + input.mes + '</span>';
          }
          if(input.dia) {
            date += '<span class="dia">/' + input.dia + '</span>';
          }
          return $sce.trustAsHtml(date);
        }
      }
    ]);

    app.filter('caseLocation', [
      '$sce',
      function($sce) {
        return function(input) {
          var location = '';
          if(input.terra_indigena) {
            location = '<span class="ti">' + input.terra_indigena + '</span>';
          }
          if(input.municipio) {
            location += '<span class="mun">' + input.municipio + '</span>';
          }
          if(input.uf) {
            location += '<span class="uf">' + input.uf + '</span>';
          }
          return $sce.trustAsHtml(location);
        }
      }
    ])

    app.filter('postToMarker', [
      function() {
        return _.memoize(function(input) {

          if(input && input.length) {

            var markers = {};

            _.each(input, function(post) {

              if(post.coordinates) {
                markers[post.ID] = {
                  lat: post.coordinates[1],
                  lng: post.coordinates[0],
                  message: '<h2>' + post.title + '</h2>' + '<p>' + post.formatted_address + '</p>'
                };
              }

            });

            return markers;

          }

          return {};

        }, function() {
          return JSON.stringify(arguments);
        });
      }
    ]);

  }

})();

},{}],4:[function(require,module,exports){
(function(angular, undefined) {

  var app = angular.module('vindigena', [
    'ui.router'
  ]);

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

      $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
      });
      $locationProvider.hashPrefix('!');

      $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl'
      });

      /*
      * Trailing slash rule
      */
      $urlRouterProvider.rule(function($injector, $location) {
      	var path = $location.path(),
      	search = $location.search(),
      	params;

      	// check to see if the path already ends in '/'
      	if (path[path.length - 1] === '/') {
      		return;
      	}

      	// If there was no search string / query params, return with a `/`
      	if (Object.keys(search).length === 0) {
      		return path + '/';
      	}

      	// Otherwise build the search string and return a `/?` prefix
      	params = [];
      	angular.forEach(search, function(v, k){
      		params.push(k + '=' + v);
      	});

      	return path + '/?' + params.join('&');
      });

    }
  ]);

  require('./services')(app);
  require('./filters')(app);
  require('./directives')(app);
  require('./controllers')(app);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['vindigena']);
  });

})(window.angular);

},{"./controllers":1,"./directives":2,"./filters":3,"./services":5}],5:[function(require,module,exports){
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
          getLayer: function(layerObj) {
            var layer = {
              name: layerObj.title
            };
            if(layerObj.type == 'mapbox') {
              layer.layer = L.mapbox.tileLayer(layerObj.mapbox_id);
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

},{}]},{},[4]);
