<?php

/*
 * VINDIG Case
 */

class Vindig_Case {

  function __construct() {
    add_action('init', array($this, 'register_post_type'));
    // add_action('init', array($this, 'geocode'));
    add_filter('json_prepare_post', array($this, 'json_prepare_post'), 10, 3);
    add_filter('acf/fields/relationship/result', array($this, 'relationship_result'), 10, 4);
    add_filter('posts_clauses', array($this, 'posts_clauses'), 10, 2);
    add_action('pre_get_posts', array($this, 'pre_get_posts'), 5);
    add_filter('json_serve_request', array($this, 'json_serve_request'), 20, 5);
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
      'supports' => array('title', 'revisions', 'custom-fields'),
      'public' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'has_archive' => true,
      'menu_position' => 4,
      'rewrite' => false
    );

    register_post_type('case', $args);

  }

  function json_prepare_post($_post, $post, $context) {
    if($post['post_type'] == 'case') {

      $_post['nome'] = get_post_meta($post['ID'], 'nome', true);
      $_post['apelido'] = get_post_meta($post['ID'], 'apelido', true);
      $_post['idade'] = get_post_meta($post['ID'], 'idade', true);
      $_post['descricao'] = get_post_meta($post['ID'], 'descricao', true);
      $_post['povo'] = get_post_meta($post['ID'], 'povo', true);
      $_post['aldeia'] = get_post_meta($post['ID'], 'aldeia', true);
      $_post['dia'] = get_post_meta($post['ID'], 'dia', true);
      $_post['mes'] = get_post_meta($post['ID'], 'mes', true);
      $_post['ano'] = get_post_meta($post['ID'], 'ano', true);
      $_post['cod_ibge'] = get_post_meta($post['ID'], 'cod_ibge', true);
      $_post['municipio'] = get_post_meta($post['ID'], 'municipio', true);
      $_post['uf'] = get_post_meta($post['ID'], 'uf', true);
      $_post['relatorio'] = get_post_meta($post['ID'], 'relatorio', true);
      $_post['cod_funai'] = get_post_meta($post['ID'], 'cod_funai', true);
      $_post['terra_indigena'] = get_post_meta($post['ID'], 'terra_indigena', true);
      $_post['fonte_cimi'] = get_post_meta($post['ID'], 'fonte_cimi', true);

    }
    return $_post;
  }

  function relationship_result($title, $post, $field, $the_post) {
    if($post->post_type = 'case') {
      $title = $title . ' (' . get_post_meta($post->ID, 'municipio', true) . ' - ' . get_post_meta($post->ID, 'uf', true) . ')';
    }
    return $title;
  }

  function posts_clauses($clauses, $query) {
    global $wpdb, $wp;
    if($query->is_search && ($query->get('post_type') == 'case' || $query->get('post_type') == array('case'))) {
      $clauses['join'] .= " LEFT JOIN $wpdb->postmeta ON ($wpdb->posts.ID = $wpdb->postmeta.post_id) ";
      $like = '%' . $wpdb->esc_like( $query->get('s') ) . '%';
      $meta_like = str_replace(' ', '%', $like);
      $clauses['where'] = preg_replace(
        "/$wpdb->posts.post_title/",
        "$wpdb->postmeta.meta_value",
        $clauses['where']
      );
      $clauses['distinct'] = 'DISTINCT';
    }
    return $clauses;
  }

  function pre_get_posts($query) {
    if(isset($_REQUEST['csv'])) {
      $query->set('posts_per_page', -1);
    }
    if($query->get('post_type') == 'case' || $query->get('post_type') == array('case')) {
      $query->set('meta_key', 'nome');
      $query->set('orderby', 'meta_value');
      $query->set('order', 'ASC');
    }
  }

  function json_serve_request($bool, $result, $path, $method, $json_server) {
    if(isset($_REQUEST['csv'])) {
      $this->outputCsv('casos.csv', $result->data);
      exit();
    }
  }

  public function outputCsv($fileName, $assocDataArray) {
    ob_clean();
    header('Pragma: public');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Cache-Control: private', false);
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment;filename=' . $fileName);
    if(isset($assocDataArray[0])) {
        $fp = fopen('php://output', 'w');
        fputcsv($fp, array_keys($assocDataArray[0]));
        foreach($assocDataArray AS $values) {
            foreach($values as $key => $val) {
              if(is_array($val) && !$this->isAssoc($val)) {
                $values[$key] = implode(',', $val);
              }
            }
            fputcsv($fp, $values);
        }
        fclose($fp);
    }
    ob_flush();
  }

  function isAssoc($arr) {
    return array_keys($arr) !== range(0, count($arr) - 1);
  }

  function geocode() {

    global $post;

    if(isset($_GET['geocode_cases'])) {

      $tis = json_decode(file_get_contents(STYLESHEETPATH . '/data/tis.json'), true);
      $municipios = json_decode(file_get_contents(STYLESHEETPATH . '/data/municipios.json'), true);

      $query = new WP_Query(array(
        'post_type' => 'case',
        'posts_per_page' => -1
      ));

      if($query->have_posts()) {
        while($query->have_posts()) {
          $geocoded = false;
          $method = 'none';
          $query->the_post();
          $funai = get_post_meta($post->ID, 'cod_funai', true);
          $ibge = get_post_meta($post->ID, 'cod_ibge', true);
          if($funai) {
              $method = 'ti';
            foreach($tis['rows'] as $ti) {
              if($ti['terrai_cod'] == $funai) {
                update_post_meta($post->ID, 'geocode_latitude', $ti['lat']);
                update_post_meta($post->ID, 'geocode_longitude', $ti['lon']);
                $geocoded = true;
              }
            }
          } elseif($ibge) {
            $method = 'mun';
            foreach($municipios['rows'] as $mun) {
              if(intval($mun['co_ibge3']) == intval(substr($ibge, 0, -1))) {
                update_post_meta($post->ID, 'geocode_latitude', $mun['lat']);
                update_post_meta($post->ID, 'geocode_longitude', $mun['lon']);
                $geocoded = true;
              }
            }
          }
          if(!$geocoded)
            error_log('Could not geocode ' . $post->ID . ' through method "' . $method . '"');
          wp_reset_postdata();
        }
      }

      error_log('done');

    }

  }

}

new Vindig_Case();
