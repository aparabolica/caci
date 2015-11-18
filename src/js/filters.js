(function(undefined) {

  module.exports = function(app) {

    app.filter('casoName', [
      function() {
        return function(input) {
          var name = '';
          if(input) {
            if(input.NOME) {
              name += input.NOME;
              if(input.APELIDO) {
                name += ' (' + input.APELIDO + ')';
              }
            } else if(input.APELIDO) {
              name += input.APELIDO;
            } else {
              name += 'Não identificado';
            }
            if(input.IDADE) {
              name += ', ' + input.IDADE + ' anos';
            }
          }
          return name;
        }
      }
    ]);

    app.filter('postToMarker', [
      function() {
        return _.memoize(function(input) {

          if(input && input.length) {

            var markers = {};

            _.each(input, function(post) {

              if(post.coordinates) {
                markers[post.ID] = {
                  lat: post.coordinates[1],
                  lng: post.coordinates[0],
                  message: '<h2>' + post.title + '</h2>' + '<p>' + post.formatted_address + '</p>'
                };
              }

            });

            return markers;

          }

          return {};

        }, function() {
          return JSON.stringify(arguments);
        });
      }
    ]);

  }

})();
