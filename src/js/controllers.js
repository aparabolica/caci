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
