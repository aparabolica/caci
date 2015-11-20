(function(undefined) {

  module.exports = function(app) {

    app.controller('MainCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      '$timeout',
      'Vindig',
      function($rootScope, $scope, $state, $timeout, Vindig) {
        // $scope.initialized = true;
        $scope.home = function() {
          if($state.current.name == 'home')
            $scope.initialized = false;
        };
        $scope.init = function() {
          $scope.initialized = true;
        };

        $scope.isDossier = false;

        $rootScope.$on('$stateChangeSuccess', function(ev, toState) {
          if(toState.name !== 'home')
            $scope.initialized = true;
          if(toState.name == 'home.dossier')
            $scope.isDossier = true;
          else
            $scope.isDossier = false;
        });

        $scope.$watch('isDossier', function(isDossier, prev) {
          var halfWindow = jQuery(window).width()/2;
          var options = {
            paddingBottomRight: [0,0],
            paddingTopLeft: [0,0]
          };
          if(isDossier) {
            options.paddingTopLeft[0] = halfWindow;
          } else if(prev) {
            options.paddingTopLeft[0] = -halfWindow;
          }
          $timeout(function() {
            $rootScope.$broadcast('invalidateMap', options);
          }, 420);
        });

        Vindig.cases().then(function(data) {
          $scope.casos = data.data;
          var totalPages = data.headers('X-WP-TotalPages');
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
      'Dossiers',
      function($scope, Dossiers) {
        console.log(Dossiers);
        $scope.dossiers = Dossiers.data;
      }
    ]);

    app.controller('DossierCtrl', [
      '$scope',
      '$sce',
      'Dossier',
      function($scope, $sce, Dossier) {
        $scope.dossier = Dossier.data;
        $scope.dossier.content = $sce.trustAsHtml($scope.dossier.content);

        console.log($scope.dossier);
      }
    ])

  };

})();
