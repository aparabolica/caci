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

        // Dossiers
        $scope.toggleDossiers = function() {
          if($scope.showDossiers) {
            $scope.showDossiers = false;
          } else {
            $scope.showDossiers = true;
          }
        }
        $rootScope.$on('$stateChangeStart', function() {
          $scope.showDossiers = false;
        });

        // Adv nav
        $scope.toggleAdvFilters = function() {
          if($scope.showAdvFilters) {
            $scope.showAdvFilters = false;
          } else {
            $scope.showAdvFilters = true;
          }
        }
        $rootScope.$on('$stateChangeStart', function() {
          $scope.showAdvFilters = false;
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

        if($state.current.name == 'home.dossier' || $state.current.name == 'home.dossier.case')
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

          if(toState.name !== 'home.dossier' && toState.name !== 'home.dossier.case')
          $scope.dossierCases = false;

          if(toState.name == 'home.dossier' || toState.name == 'home.dossier.case')
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

        $scope.downloadCasos = function(casos) {
          JSONToCSV(casos, 'casos', true);
        };

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
      '$state',
      function($rootScope, $timeout, $scope, $sce, Dossier, Map, $state) {

        $scope.url = $state.href('home.dossier', {id: Dossier.data.ID}, {
          absolute: true
        });

        $scope.dossier = Dossier.data;
        $scope.dossier.content = $sce.trustAsHtml($scope.dossier.content);
        $scope.$emit('dossierMap', Map);
        $timeout(function() {
          $rootScope.$broadcast('invalidateMap');
        }, 300);
        $rootScope.$broadcast('dossierCases', $scope.dossier.casos);

        $scope.whatsapp = 'whatsapp://send?text=' + encodeURIComponent($scope.dossier.title + ' ' + $scope.url);
        $scope.base = vindig.base;

      }
    ]);

    app.controller('CaseCtrl', [
      '$rootScope',
      '$state',
      '$stateParams',
      '$scope',
      '$sce',
      'Case',
      function($rootScope, $state, $stateParams, $scope, $sce, Case) {
        $scope.caso = Case.data;
        $scope.caso.content = $sce.trustAsHtml($scope.caso.content);
        if($stateParams.focus != false) {
          $rootScope.$broadcast('focusMap', $scope.caso.coordinates);
        }
        $rootScope.$broadcast('invalidateMap');

        $scope.close = function() {
          if($state.current.name.indexOf('dossier') !== -1) {
            $state.go('home.dossier', $state.current.params);
          } else {
            $state.go('home');
          }
        };

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
