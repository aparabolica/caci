(function(undefined) {

  module.exports = function(app) {

    app.controller('MainCtrl', [
      '$scope',
      function($scope) {
        $scope.init = function() {
          $scope.initialized = true;
        }
      }
    ]);

    app.controller('HomeCtrl', [
      '$scope',
      'Casos',
      function($scope, Casos) {
        $scope.casos = Casos.data;
        console.log($scope.casos);
      }
    ])

  };

})();
