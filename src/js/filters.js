(function(_, undefined) {

  module.exports = function(app) {

    app.filter('offset', function() {
      return function(input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
      };
    });

    app.filter('exact', function() {
      return function(input, match){
        var matching = [], matches, falsely = true;

        // Return the input unchanged if all filtering attributes are falsy
        angular.forEach(match, function(value, key){
          falsely = falsely && !value;
        });
        if(falsely){
          return input;
        }

        angular.forEach(input, function(item){ // e.g. { title: "ball" }
          matches = true;
          angular.forEach(match, function(value, key){ // e.g. 'all', 'title'
            if(!!value){ // do not compare if value is empty
              matches = matches && (item[key] === value);
            }
          });
          if(matches){
            matching.push(item);
          }
        });
        return matching;
      }
    });

    app.filter('caseIds', function() {
      return function(input, cases) {
        if(cases && cases.length) {
          input = _.filter(input, function(item) {
            return cases.indexOf(item.ID) != -1;
          });
        }
        return input;
      }
    });

    app.filter('casoName', [
      function() {
        return function(input) {
          var name = '';
          if(input) {
            if(input.nome) {
              name += input.nome;
              if(input.apelido) {
                name += ' (' + input.apelido + ')';
              }
            } else if(input.apelido) {
              name += input.apelido;
            } else {
              name += 'Não identificado';
            }
            // if(input.idade) {
            //   name += ', ' + input.idade + ' anos';
            // }
          }
          return name;
        }
      }
    ]);

    app.filter('casoDate', [
      '$sce',
      function($sce) {
        return function(input) {
          var date = '';
          if(input.ano) {
            date = '<span class="ano">' + input.ano + '</span>';
          }
          if(input.mes) {
            date += '<span class="mes">/' + input.mes + '</span>';
          }
          if(input.dia) {
            date += '<span class="dia">/' + input.dia + '</span>';
          }
          return $sce.trustAsHtml(date);
        }
      }
    ]);

    app.filter('caseLocation', [
      '$sce',
      function($sce) {
        return function(input, showLabels) {
          var location = '';
          if(input.terra_indigena) {
            if(showLabels)
              location = '<span class="ti"><span class="label">Terra indígena</span> ' + input.terra_indigena + '</span>';
            else
              location = '<span class="ti">' + input.terra_indigena + '</span>';
          }
          if(input.municipio) {
            if(showLabels)
              location += '<span class="mun"><span class="label">Município</span> ' + input.municipio + '</span>';
            else
              location += '<span class="mun">' + input.municipio + '</span>';
          }
          if(input.uf) {
            if(showLabels)
              location += '<span class="uf"><span class="label">Estado</span> ' + input.uf + '</span>';
            else
              location += '<span class="uf">' + input.uf + '</span>';
          }
          return $sce.trustAsHtml(location);
        }
      }
    ]);

    app.filter('dateFilter', [
      function() {
        return function(input, range) {
          if(input && input.length) {
            input = _.filter(input, function(item) {
              var ano = parseInt(item.ano);
              return ano >= range.min && ano <= range.max;
            });
          }
          return input;
        }
      }
    ]);

    app.filter('postToMarker', [
      'casoNameFilter',
      '$state',
      function(casoNameFilter, $state) {
        return _.memoize(function(input, defaultParentState, stateWhitelist) {

          var state = '';

          if($state.current.name == stateWhitelist) {
            state += stateWhitelist + '.';
          } else if(defaultParentState) {
            state += defaultParentState + '.';
          }

          if(input && input.length) {

            var markers = {};

            _.each(input, function(post) {

              if(post.coordinates) {
                params = {};
                params[post.type + 'Id'] = post.ID
                markers[post.ID] = {
                  lat: post.coordinates[1],
                  lng: post.coordinates[0],
                  message: '<h2>' + casoNameFilter(post) + '</h2>',
                  state: {
                    name: state + post.type,
                    params: params
                  }
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

})(window._);
