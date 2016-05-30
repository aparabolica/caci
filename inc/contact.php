<?php

/*
 * VINDIG Contact
 */

class Vindig_Contact {

  function __construct() {

    add_filter('json_endpoints', array($this, 'contact_endpoints'));

  }

  function contact_endpoints($routes) {

    $contact_routes = array(
      '/contact' => array(
        array(array($this, 'contact'), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON)
      )
    );

    return array_merge($routes, $contact_routes);

  }

  function contact($data) {
    $value = array(
      'name' => $data['name'],
      'email' => $data['email'],
      'message' => $data['body']
    );

    // Send email
    $email = get_option('admin_email');
    $body = '<p>Nova mensagem de <strong>' . $value['name'] . '</strong></p><p><strong>Mensagem</strong>:</p><p><blockquote>' . $data['body'] . '</blockquote></p>';
    $headers = array('From:' . $value['name'] . '<' . $value['email'] . '>;Content-Type:text/html;charset=UTF-8');
    wp_mail($email, '[CACI] Nova mensagem de ' . $value['name'], $body, $headers);

    $response = json_ensure_response($result);
    $response->set_status(201);
    return $response;

  }

}

new Vindig_Contact();

?>
