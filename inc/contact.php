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
      'body' => $data['body']
    );

    // Send email
    $email = get_option('admin_email');
    $body = '<p>Nova mensagem de <strong>' . $value['name'] . '</strong></p><p>Email: <strong>' . $value['email'] . '</strong></p><p><strong>Mensagem</strong>:</p><p><blockquote>' . $data['body'] . '</blockquote></p>';
    $headers = array('Content-Type:text/html;charset=UTF-8');

    $mailed = wp_mail($email, '[CACI] Nova mensagem de ' . $value['name'], $body, $headers);

    if(!$mailed) {
      return new WP_Error( 'vindig_mail_error', print_r($GLOBALS['phpmailer']->ErrorInfo, true), array( 'status' => 500 ) );
    }

    $response = json_ensure_response(true);
    $response->set_status(201);
    return $response;

  }

}

new Vindig_Contact();

?>
