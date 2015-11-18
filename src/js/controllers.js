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
