(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(undefined) {

  module.exports = function(app) {

    app.controller('MainCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      '$timeout',
      'Vindig',
      function($rootScope, $scope, $state, $timeout, Vindig) {

        // Pages
        Vindig.pages().then(function(data) {
          $scope.pages = data.data;
        });

        // Nav
        $scope.toggleNav = function() {
          if($scope.showNav) {
            $scope.showNav = false;
          } else {
            $scope.showNav = true;
          }
        }
        $rootScope.$on('$stateChangeStart', function() {
          $scope.showNav = false;
        });

        $scope.home = function() {
          if($state.current.name == 'home')
            $scope.initialized = false;
        };
        $scope.init = function() {
          $scope.initialized = true;
        };

        $scope.$watch('initialized', function() {
          $timeout(function() {
            $rootScope.$broadcast('invalidateMap');
          }, 200);
        });

        if($state.current.name == 'home.dossier')
          $scope.isDossier = true;
        else
          $scope.isDossier = false;

        if($state.current.name == 'home.case')
          $scope.isCase = true;
        else
          $scope.isCase = false;

        $rootScope.$on('dossierCases', function(ev, cases) {
          $scope.dossierCases = cases;
        });

        $rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {

          if(toState.name !== 'home')
            $scope.initialized = true;

          if(fromState.name == 'home.case')
            $rootScope.$broadcast('invalidateMap');

        });

        $rootScope.$on('$stateChangeStart', function(ev, toState) {

          $scope.dossierCases = false;

          if(toState.name == 'home.dossier')
            $scope.isDossier = true;
          else
            $scope.isDossier = false;

          if(toState.name == 'home.case')
            $scope.isCase = true;
          else
            $scope.isCase = false;
        });

        $scope.$watch('isDossier', function(isDossier, prev) {
          if(isDossier !== prev) {
            $rootScope.$broadcast('invalidateMap');
          }
        });

        // Async get cases
        Vindig.cases().then(function(res) {
          $scope.casos = res.data;
          var totalPages = res.headers('X-WP-TotalPages');
          for(var i = 2; i <= totalPages; i++) {
            Vindig.cases({page: i}).then(function(res) {
              $scope.casos = $scope.casos.concat(res.data);
            });
          }
        });

        Vindig.dossiers().then(function(res) {
          $scope.dossiers = res.data;
        });

        var anos;

        $scope.filter = {
          text: '',
          date: {
            min: 0,
            max: 0
          }
        };
        $scope.dateFilters = [];
        $scope.dropdownFilters = {};
        $scope.$watch('casos', function(casos) {

          var anos = _.sortBy(Vindig.getUniq(casos, 'ano'), function(item) { return parseInt(item); });

          $scope.dateFilters = [parseInt(_.min(anos)), parseInt(_.max(anos))];
          $scope.filter.date.min = parseInt(_.min(anos));
          $scope.filter.date.max = parseInt(_.max(anos));

          $scope.dropdownFilters.uf = _.sortBy(Vindig.getUniq(casos, 'uf'), function(item) { return item; });
          $scope.dropdownFilters.relatorio = _.sortBy(Vindig.getUniq(casos, 'relatorio'), function(item) { return item; });
          $scope.dropdownFilters.povo = _.sortBy(Vindig.getUniq(casos, 'povo'), function(item) { return item; });

        });

        $scope.clearFilters = function() {
          $scope.filter.text = '';
          $scope.filter.date.min = parseInt(_.min(anos));
          $scope.filter.date.max = parseInt(_.max(anos));
          $scope.filter.strict = {};
        }

        $scope.$on('$stateChangeSuccess', function(ev, toState) {
          if(toState.name == 'home.dossier') {
            $scope.clearFilters();
          }
        });

        $scope.focusMap = function(caso) {
          $rootScope.$broadcast('focusMap', caso.coordinates);
        };

        // Case list
        $scope.showList = false
        $scope.toggleCasos = function() {
          if($scope.showList) {
            $scope.showList = false;
          } else {
            $scope.showList = true;
          }
          $timeout(function() {
            $rootScope.$broadcast('invalidateMap');
          }, 200);
        }
      }
    ]);

    app.controller('HomeCtrl', [
      '$scope',
      'Map',
      function($scope, Map) {

        $scope.$on('$stateChangeSuccess', function(ev, toState) {
          if(toState.name == 'home' || toState.name == 'home.case' || toState.name == 'home.page') {
            $scope.mapData = Map;
          }
        });

        $scope.$on('dossierMap', function(ev, map) {
          $scope.mapData = map;
        });

      }
    ]);

    app.controller('DossierCtrl', [
      '$rootScope',
      '$timeout',
      '$scope',
      '$sce',
      'Dossier',
      'DossierMap',
      function($rootScope, $timeout, $scope, $sce, Dossier, Map) {
        $scope.dossier = Dossier.data;
        $scope.dossier.content = $sce.trustAsHtml($scope.dossier.content);
        $scope.$emit('dossierMap', Map);
        $timeout(function() {
          $rootScope.$broadcast('invalidateMap');
        }, 300);
        $rootScope.$broadcast('dossierCases', $scope.dossier.casos);
      }
    ]);

    app.controller('CaseCtrl', [
      '$rootScope',
      '$stateParams',
      '$scope',
      '$sce',
      'Case',
      function($rootScope, $stateParams, $scope, $sce, Case) {
        $scope.caso = Case.data;
        $scope.caso.content = $sce.trustAsHtml($scope.caso.content);
        if($stateParams.focus != false) {
          $rootScope.$broadcast('focusMap', $scope.caso.coordinates);
        }
        $rootScope.$broadcast('invalidateMap');
      }
    ]);

    app.controller('PageCtrl', [
      '$scope',
      '$sce',
      'Page',
      function($scope, $sce, Page) {
        $scope.page = Page.data;
        $scope.page.content = $sce.trustAsHtml($scope.page.content);
      }
    ]);

  };

})();

},{}],2:[function(require,module,exports){
(function(vindig, jQuery, L, undefined) {

  L.mapbox.accessToken = "pk.eyJ1IjoiaW5mb2FtYXpvbmlhIiwiYSI6InItajRmMGsifQ.JnRnLDiUXSEpgn7bPDzp7g"

  module.exports = function(app) {

    app.directive('forceOnclick', [
      function() {
        return {
          restrict: 'A',
          scope: {
            'forceOnclick': '=',
            'forceParent': '@'
          },
          link: function(scope, element, attrs) {
            var ms = scope.forceOnclick || 500;
            var el;
            if(scope.forceParent) {
              el = jQuery('#' + scope.forceParent);
            } else {
              el = jQuery(element);
            }
            jQuery(element).on('click', function() {
              el.addClass('force');
              setTimeout(function() {
                el.removeClass('force');
              }, ms);
            });
          }
        }
      }
    ])

    app.directive('map', [
      '$rootScope',
      '$state',
      'Vindig',
      function($rootScope, $state, Vindig) {
        return {
          restrict: 'E',
          scope: {
            'mapData': '=',
            'markers': '=',
            'heatMarker': '='
          },
          link: function(scope, element, attrs) {

            angular.element(element)
              .append('<div id="' + attrs.id + '"></div>')
              .attr('id', '');

            var map = L.map(attrs.id, {
              center: [0,0],
              zoom: 2,
              maxZoom: 18
            });

            // watch map invalidation
            $rootScope.$on('invalidateMap', function() {
              setTimeout(function() {
                map.invalidateSize(true);
              }, 15);
            });

            // watch focus map
            var calledFocus;
            $rootScope.$on('focusMap', function(ev, coordinates) {
              calledFocus = coordinates;
              map.fitBounds(L.latLngBounds([[coordinates[1], coordinates[0]]]));
            });

            /*
             * Map data
             */
            scope.mapData = false;
            var mapInit = false
            scope.$watch('mapData', function(mapData, prev) {
              if(mapData.ID !== prev.ID || !mapInit) {
                mapInit = true;
                scope.layers = mapData.layers;
                setTimeout(function() {
                  if(mapData.min_zoom)
                    map.options.minZoom = parseInt(mapData.min_zoom);
                  if(mapData.max_zoom)
                    map.options.maxZoom = parseInt(mapData.max_zoom);
                  if(mapData.pan_limits) {
                    map.setMaxBounds(L.latLngBounds(
                      [
                        mapData.pan_limits.south,
                        mapData.pan_limits.west
                      ],
                      [
                        mapData.pan_limits.north,
                        mapData.pan_limits.east
                      ]
                    ));
                  }
                  if(calledFocus) {
                    map.fitBounds(L.latLngBounds([[calledFocus[1], calledFocus[0]]]));
                    calledFocus = false;
                  } else {
                    map.setView(mapData.center);
                    map.setZoom(mapData.zoom);
                  }
                }, 500);
              }
            });

            /*
             * Markers
             */
            var icon = L.divIcon({
              className: 'pin',
              iconSize: [18,18],
              iconAnchor: [9, 18],
              popupAnchor: [0, -18]
            });

            var markerLayer = L.markerClusterGroup({
              zIndex: 100,
              maxClusterRadius: 40,
              polygonOptions: {
                fillColor: '#000',
                color: '#000',
                opacity: .3,
                weight: 2
              },
              spiderLegPolylineOptions: {
                weight: 1,
                color: '#222',
                opacity: 0.4
              },
              iconCreateFunction: function(cluster) {

                var childCount = cluster.getChildCount();

                var c = ' marker-cluster-';
                if (childCount < 10) {
                  c += 'small';
                } else if (childCount < 100) {
                  c += 'medium';
                } else {
                  c += 'large';
                }

                var icon = L.divIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });

                return icon;

              }
            });

            markerLayer.addTo(map);

            console.log(scope.heatMarker);

            if(scope.heatMarker) {
              var heatLayer = L.heatLayer([], {
                blur: 30
              });
              heatLayer.addTo(map);
            }

            var markers = [];
            var latlngs = [];
            scope.$watch('markers', _.debounce(function(posts) {
              for(var key in markers) {
                markerLayer.removeLayer(markers[key]);
              }
              markers = [];
              latlngs = [];
              for(var key in posts) {
                var post = posts[key];
                latlngs.push([post.lat,post.lng]);
                markers[key] = L.marker([post.lat,post.lng], {
                  icon: icon
                });
                markers[key].post = post;
                markers[key].bindPopup(post.message);
                markers[key].on('mouseover', function(ev) {
                  ev.target.openPopup();
                });
                markers[key].on('mouseout', function(ev) {
                  ev.target.closePopup();
                });
                markers[key].on('click', function(ev) {
                  var params =  _.extend({
                    focus: false
                  }, ev.target.post.state.params);
                  $state.go(ev.target.post.state.name, params);
                });
              }
              for(var key in markers) {
                markers[key].addTo(markerLayer);
              }
              if(scope.heatMarker)
                heatLayer.setLatLngs(latlngs);
            }, 300), true);

            /*
             * Layers
             */

            scope.layers = [];

            var fixed = [];
            var swapable = [];
            var switchable = [];

            var layerMap = {};

            var layerControl = L.control.layers({}, {}, {
              collapsed: false,
              position: 'bottomright',
              autoZIndex: false
            }).addTo(map);

            map.on('layeradd', function(ev) {
              if(ev.layer._vindig_id) {
                if(layerMap[ev.layer._vindig_id].control)
                  map.addControl(layerMap[ev.layer._vindig_id].control);
              }
            });
            map.on('layerremove', function(ev) {
              if(ev.layer._vindig_id) {
                if(layerMap[ev.layer._vindig_id].control)
                  map.removeControl(layerMap[ev.layer._vindig_id].control);
              }
            });

            scope.$watch('layers', function(layers, prevLayers) {

              if(layers !== prevLayers || _.isEmpty(layerMap)) {

                if(prevLayers && prevLayers.length) {
                  if(fixed.length) {
                    _.each(fixed, function(l) {
                      map.removeLayer(l.layer);
                    });
                    fixed = [];
                  }
                  if(swapable.length) {
                    _.each(swapable, function(l) {
                      layerControl.removeLayer(l.layer);
                    });
                    swapable = [];
                  }
                  if(switchable.length) {
                    _.each(switchable, function(l) {
                      layerControl.removeLayer(l.layer);
                    });
                    switchable = [];
                  }
                }

                if(layers && layers.length) {
                  _.each(layers, function(layer, i) {
                    layer.zIndex = i+10;
                    layer.ID = layer.ID || 'base';
                    if(!layerMap[layer.ID] || layer.ID == 'base')
                      layerMap[layer.ID] = Vindig.getLayer(layer, map);
                    if(layer.filtering == 'fixed' || !layer.filtering) {
                      fixed.push(layerMap[layer.ID]);
                    } else if(layer.filtering == 'swap') {
                      swapable.push(layerMap[layer.ID]);
                    } else if(layer.filtering == 'switch') {
                      switchable.push(layerMap[layer.ID]);
                    }
                  });

                  _.each(fixed, function(layer) {
                    map.addLayer(layer.layer);
                  });

                  _.each(swapable, function(layer) {
                    layerControl.addBaseLayer(layer.layer, layer.name);
                  });

                  _.each(switchable, function(layer) {
                    layerControl.addOverlay(layer.layer, layer.name);
                  });

                }

              }

            });

          }
        }
      }
    ])

  };

})(window.vindig, window.jQuery, window.L);

},{}],3:[function(require,module,exports){
(function(_, undefined) {

  module.exports = function(app) {

    app.filter('exact', function() {
      return function(input, match){
        var matching = [], matches, falsely = true;

        // Return the input unchanged if all filtering attributes are falsy
        angular.forEach(match, function(value, key){
          falsely = falsely && !value;
        });
        if(falsely){
          return input;
        }

        angular.forEach(input, function(item){ // e.g. { title: "ball" }
          matches = true;
          angular.forEach(match, function(value, key){ // e.g. 'all', 'title'
            if(!!value){ // do not compare if value is empty
              matches = matches && (item[key] === value);
            }
          });
          if(matches){
            matching.push(item);
          }
        });
        return matching;
      }
    });

    app.filter('caseIds', function() {
      return function(input, cases) {
        if(cases && cases.length) {
          input = _.filter(input, function(item) {
            return cases.indexOf(item.ID) != -1;
          });
        }
        return input;
      }
    });

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
            // if(input.idade) {
            //   name += ', ' + input.idade + ' anos';
            // }
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
    ]);

    app.filter('dateFilter', [
      function() {
        return function(input, range) {
          if(input && input.length) {
            input = _.filter(input, function(item) {
              var ano = parseInt(item.ano);
              return ano >= range.min && ano <= range.max;
            });
          }
          return input;
        }
      }
    ]);

    app.filter('postToMarker', [
      'casoNameFilter',
      function(casoNameFilter) {
        return _.memoize(function(input) {

          if(input && input.length) {

            var markers = {};

            _.each(input, function(post) {

              if(post.coordinates) {
                markers[post.ID] = {
                  lat: post.coordinates[1],
                  lng: post.coordinates[0],
                  message: '<h2>' + casoNameFilter(post) + '</h2>',
                  state: {
                    name: 'home.' + post.type,
                    params: {id: post.ID}
                  }
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

})(window._);

},{}],4:[function(require,module,exports){
(function(angular, vindig, undefined) {

  var app = angular.module('vindigena', [
    'ui.router',
    'ui-rangeSlider',
    'fitVids'
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
        controller: 'HomeCtrl',
        templateUrl: vindig.base + '/views/index.html',
        resolve: {
          Map: [
            '$q',
            'Vindig',
            function($q, Vindig) {
              var deferred = $q.defer();
              if(vindig.featured_map) {
                Vindig.getPost(vindig.featured_map).then(function(data) {
                  deferred.resolve(data.data);
                });
              } else {
                Vindig.maps().then(function(data) {
                  deferred.resolve(data.data[0]);
                });
              }
              return deferred.promise;
            }
          ]
        }
      })
      .state('home.page', {
        url: 'p/:id/',
        controller: 'PageCtrl',
        templateUrl: vindig.base + '/views/page.html',
        resolve: {
          Page: [
            '$stateParams',
            'Vindig',
            function($stateParams, Vindig) {
              return Vindig.getPost($stateParams.id);
            }
          ]
        }
      })
      .state('home.case', {
        url: 'caso/:id/',
        controller: 'CaseCtrl',
        templateUrl: vindig.base + '/views/case.html',
        params: {
          focus: true
        },
        resolve: {
          Case: [
            '$stateParams',
            'Vindig',
            function($stateParams, Vindig) {
              return Vindig.getPost($stateParams.id);
            }
          ]
        }
      })
      .state('home.dossier', {
        url: 'dossie/:id/',
        controller: 'DossierCtrl',
        templateUrl: vindig.base + '/views/dossier.html',
        resolve: {
          Dossier: [
            '$stateParams',
            'Vindig',
            function($stateParams, Vindig) {
              return Vindig.getPost($stateParams.id);
            }
          ],
          DossierMap: [
            '$q',
            'Dossier',
            'Vindig',
            function($q, Dossier, Vindig) {
              var mapId = Dossier.data.maps.length ? Dossier.data.maps[0] : vindig.featured_map;
              var deferred = $q.defer();
              Vindig.getPost(mapId).then(function(data) {
                deferred.resolve(data.data);
              });
              return deferred.promise;
            }
          ]
        }
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

})(window.angular, window.vindig);

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
          pages: function(params, filter) {
            params = params || {};
            params = _.extend({
              type: 'page'
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

},{}]},{},[4]);
