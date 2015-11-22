<?php

/*
 * VINDIG Dossier
 */

class Vindig_Dossier {

  function __construct() {
    add_action('init', array($this, 'register_post_type'));
    add_filter('json_prepare_post', array($this, 'json_prepare_post'), 10, 3);
    add_action('init', array($this, 'register_fields'));
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

  function register_fields() {

    if(function_exists("register_field_group")) {
      register_field_group(array (
        'id' => 'acf_casos',
        'title' => 'Casos',
        'fields' => array (
          array (
            'key' => 'field_5650f2e430101',
            'label' => 'Casos',
            'name' => 'casos',
            'type' => 'relationship',
            'instructions' => 'Casos relacionados ao dossiê',
            'return_format' => 'id',
            'post_type' => array(
              0 => 'case',
            ),
            'taxonomy' => array(
              0 => 'all',
            ),
            'filters' => array(
              0 => 'search',
            ),
            'result_elements' => array(
              0 => 'post_type',
              1 => 'post_title',
            ),
            'max' => '',
          ),
        ),
        'location' => array(
          array (
            array (
              'param' => 'post_type',
              'operator' => '==',
              'value' => 'dossier',
              'order_no' => 0,
              'group_no' => 0,
            ),
          ),
        ),
        'options' => array(
          'position' => 'normal',
          'layout' => 'no_box',
          'hide_on_screen' => array(),
        ),
        'menu_order' => 0,
      ));
    }

  }

  function json_prepare_post($_post, $post, $context) {
    if($post['post_type'] == 'dossier') {
      $_post['casos'] = get_field('casos', $post['ID']);
    }
    return $_post;
  }

}

new Vindig_Dossier();
