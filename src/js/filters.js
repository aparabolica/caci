(function() {

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

  }

})();
