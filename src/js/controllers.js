(function(undefined) {

  module.exports = function(app) {

    app.controller('MainCtrl', [
      '$scope',
      function($scope) {
        $scope.hello = 'World';
      }
    ]);

  };

})();
