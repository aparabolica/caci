require('./util');

(function(angular, vindig, undefined) {

  var app = angular.module('vindigena', [
    'ui.router',
    'ngCookies',
    'djds4rce.angular-socialshare',
    'ui-rangeSlider',
    'fitVids'
  ], [
    '$compileProvider',
    function($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|whatsapp|file):/);
    }
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
        url: '/?loc&init',
        controller: 'HomeCtrl',
        templateUrl: vindig.base + '/views/index.html',
        reloadOnSearch: false,
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
      .state('home.tour', {
        url: 'tour/',
        controller: 'TourCtrl',
        templateUrl: vindig.base + '/views/tour.html',
        reloadOnSearch: false
      })
      .state('home.page', {
        url: 'p/:id/',
        controller: 'PageCtrl',
        templateUrl: vindig.base + '/views/page.html',
        reloadOnSearch: false,
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
        url: 'caso/:caseId/',
        controller: 'CaseCtrl',
        templateUrl: vindig.base + '/views/case.html',
        reloadOnSearch: false,
        params: {
          focus: true
        },
        resolve: {
          Case: [
            '$stateParams',
            'Vindig',
            function($stateParams, Vindig) {
              return Vindig.getPost($stateParams.caseId);
            }
          ]
        }
      })
      .state('home.dossier', {
        url: 'dossie/:dossierId/',
        controller: 'DossierCtrl',
        templateUrl: vindig.base + '/views/dossier.html',
        reloadOnSearch: false,
        resolve: {
          Dossier: [
            '$stateParams',
            'Vindig',
            function($stateParams, Vindig) {
              return Vindig.getPost($stateParams.dossierId);
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
      })
      .state('home.dossier.case', {
        url: ':caseId/',
        controller: 'CaseCtrl',
        templateUrl: vindig.base + '/views/case.html',
        params: {
          focus: true
        },
        reloadOnSearch: false,
        resolve: {
          Case: [
            '$stateParams',
            'Vindig',
            function($stateParams, Vindig) {
              return Vindig.getPost($stateParams.caseId);
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
  ])
  .run([
    '$rootScope',
    '$FB',
    function($rootScope, $FB) {
      $FB.init('1496777703986386');

      $rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {
        // Scroll top
        if(
          fromState.name &&
          (
            fromState.name.indexOf('dossier') == -1 &&
            toState.name.indexOf('dossier') == -1
          )
        ) {
          jQuery('html,body').animate({
            scrollTop: 0
          }, 400);
        }
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
