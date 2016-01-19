<?php

/*
 * VINDIG Denuncia
 */

class Vindig_Denuncia {

  function __construct() {

    add_filter('json_endpoints', array($this, 'denuncia_endpoints'));

  }

  function denuncia_endpoints($routes) {

    $denuncia_routes = array(
      '/posts/(?P<id>\d+)/denuncia' => array(
        array(array($this, 'denuncia'), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON)
      )
    );

    return array_merge($routes, $denuncia_routes);

  }

  function denuncia($id, $data) {
    $value = array(
      'message' => $data['message'],
      'date' => date('c')
    );

    $meta = add_post_meta($id, 'denuncia', $value);

    if(!$meta) {
      
      return new WP_Error( 'vindig_denuncia_error', 'Erro ao enviar contribuição', array( 'status' => 500 ) );

    } else {

      // Send email
      $email = get_option('admin_email');
      $body = '<p>Nova contribuição anônima para o <a href="' . get_option('home') . '#!/caso/' . $id . '/">caso "' . get_the_title($id) . '"</a></p><p><strong>Mensagem</strong>:</p><p><blockquote>' . $data['message'] . '</blockquote></p>';
      $headers = array('Content-Type: text/html; charset=UTF-8');
      wp_mail($email, 'Nova contribuição para o caso #' . $id, $body, $headers);

      $response = json_ensure_response($result);
      $response->set_status(201);
      return $response;

    }


  }

}

new Vindig_Denuncia();

?>
