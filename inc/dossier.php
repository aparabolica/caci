<?php

/*
 * VINDIG Dossier
 */

class Vindig_Dossier {

  function __construct() {
    add_action('init', array($this, 'register_post_type'));
  }

  function register_post_type() {

    $labels = array(
      'name' => __('Dossiês', 'vindig'),
      'singular_name' => __('Dossiê', 'vindig'),
      'add_new' => __('Adicionar dossiê', 'vindig'),
      'add_new_item' => __('Adicionar novo dossiê', 'vindig'),
      'edit_item' => __('Editar dossiê', 'vindig'),
      'new_item' => __('Novo dossiê', 'vindig'),
      'view_item' => __('Ver dossiê', 'vindig'),
      'search_items' => __('Buscar dossiê', 'vindig'),
      'not_found' => __('Nenhum dossiê encontrado', 'vindig'),
      'not_found_in_trash' => __('Nenhum dossiê encontrado no lixo', 'vindig'),
      'menu_name' => __('Dossiês', 'vindig')
    );

    $args = array(
      'labels' => $labels,
      'hierarchical' => false,
      'description' => __('Dossiês', 'vindig'),
      'supports' => array('title', 'editor', 'excerpt', 'author', 'revisions', 'thumbnail'),
      'public' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'has_archive' => true,
      'menu_position' => 4,
      'rewrite' => false,
    );

    register_post_type('dossier', $args);

  }

}

new Vindig_Dossier();
