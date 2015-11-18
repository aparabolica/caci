<?php

/*
 * VINDIG Case
 */

class Vindig_Case {

  function __construct() {
    add_action('init', array($this, 'register_post_type'));
  }

  function register_post_type() {

    $labels = array(
      'name' => __('Casos', 'vindig'),
      'singular_name' => __('Caso', 'vindig'),
      'add_new' => __('Adicionar caso', 'vindig'),
      'add_new_item' => __('Adicionar novo caso', 'vindig'),
      'edit_item' => __('Editar caso', 'vindig'),
      'new_item' => __('Novo caso', 'vindig'),
      'view_item' => __('Ver caso', 'vindig'),
      'search_items' => __('Buscar caso', 'vindig'),
      'not_found' => __('Nenhum caso encontrado', 'vindig'),
      'not_found_in_trash' => __('Nenhum caso encontrado no lixo', 'vindig'),
      'menu_name' => __('Casos', 'vindig')
    );

    $args = array(
      'labels' => $labels,
      'hierarchical' => false,
      'description' => __('Casos', 'vindig'),
      'supports' => array('title', 'editor', 'excerpt', 'author', 'revisions', 'thumbnail', 'custom-fields'),
      'public' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'has_archive' => true,
      'menu_position' => 4,
      'rewrite' => false,
    );

    register_post_type('case', $args);

  }

}

new Vindig_Case();
