(function(vindig, undefined) {

  module.exports = function(app) {

    // Proper serialization
    app.config(['$httpProvider',
      function($httpProvider) {
        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
      }
    ]);

    app.factory('Vindig', [
      '$http',
      function($http) {
        return {
          cases: function(params, filter) {
            params = params || {};
            params = _.extend({
              type: 'case'
            }, params);

            filter = filter || {};
            filter = _.extend({
              posts_per_page: -1
            }, filter);

            params.filter = filter;

            return $http({
              method: 'GET',
              url: vindig.api + 'posts',
              params: params
            });
          },
          dossiers: function(params, filter) {
            params = params || {};
            params = _.extend({
              type: 'dossier'
            }, params);

            filter = filter || {};
            filter = _.extend({
              posts_per_page: -1
            }, filter);

            params.filter = filter;

            return $http({
              method: 'GET',
              url: vindig.api + 'posts',
              params: params
            });
          }
        }
      }
    ])

  }

})(window.vindig);
