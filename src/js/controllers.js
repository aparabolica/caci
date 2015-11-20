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

        $scope.home = function() {
          if($state.current.name == 'home')
            $scope.initialized = false;
        };
        $scope.init = function() {
          $scope.initialized = true;
        };

        if($state.current.name == 'home.dossier')
          $scope.isDossier = true;
        else
          $scope.isDossier = false;

        $rootScope.$on('$stateChangeSuccess', function(ev, toState) {

          if(toState.name !== 'home')
            $scope.initialized = true;

        });

        $rootScope.$on('$stateChangeStart', function(ev, toState) {
          if(toState.name == 'home.dossier')
            $scope.isDossier = true;
          else
            $scope.isDossier = false;
        });

        $scope.$watch('isDossier', function(isDossier, prev) {
          if(isDossier !== prev) {
            $rootScope.$broadcast('invalidateMap');
          }
        });

        // Async get cases
        Vindig.cases().then(function(data) {
          $scope.casos = data.data;
          var totalPages = data.headers('X-WP-TotalPages');
          for(var i = 2; i <= totalPages; i++) {
            Vindig.cases({page: i}).then(function(data) {
              $scope.casos = $scope.casos.concat(data.data);
            });
          }
        });

        $scope.filter = {
          text: '',
          date: {
            max: 2015,
            min: 1986
          }
        };
      }
    ]);

    app.controller('HomeCtrl', [
      '$scope',
      'Dossiers',
      'Map',
      function($scope, Dossiers, Map) {

        $scope.$on('$stateChangeSuccess', function(ev, toState) {
          if(toState.name == 'home') {
            $scope.mapData = Map;
          }
        })

        $scope.$on('dossierMap', function(ev, map) {
          $scope.mapData = map;
        });

        $scope.dossiers = Dossiers.data;
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
      }
    ])

  };

})();
