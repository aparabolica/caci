require('./util');

(function(angular, vindig, undefined) {

  var app = angular.module('vindigena', [
    'ui.router',
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
  ])
  .run([
    '$FB',
    function($FB) {
      $FB.init('1496777703986386');
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
