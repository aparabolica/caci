(function(vindig) {

  module.exports = function(app) {

    app.factory('Vindig', [
      '$http',
      function($http) {
        return {
          cases: function() {
            // return $http.get(vindig.base + '/data/1993-96.json');
            return $http.get(vindig.api + 'posts?type=case');
          },
          dossiers: function() {
            return $http.get(vindig.api + 'posts?type=dossier');
          }
        }
      }
    ])

  }

})(vindig);
