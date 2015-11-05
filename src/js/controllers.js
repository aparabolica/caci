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

  };

})();
