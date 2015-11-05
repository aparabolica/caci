(function() {

  module.exports = function(app) {

    app.factory('VIndigena', [
      '$http',
      function($http) {
        return {
          getCasos: function() {
            return $http.get('data/1993-96.json');
          }
        }
      }
    ])

  }

})();
