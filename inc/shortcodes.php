<?php

/*
 * VINDIG Shortcodes
 */

class Vindig_Shortcodes {

  function __construct() {

    add_shortcode('vindig_quote', array($this, 'quote'));
    add_shortcode('align', array($this, 'align'));

  }

  function quote($atts, $content = null) {

    $quote = '';

    $a = shortcode_atts(array(
      'author' => ''
    ), $atts);

    if($content) {

      $quote .= '<div class="quote-container">';
      $quote .= '<div class="quote-text">' . $content . '</div>';
      if($a['author']) {
        $quote .= '<div class="quote-author">' . $a['author'] . '</div>';
      }
      $quote .= '</div>';

    }

    return $quote;

  }

  function align($atts, $content = null) {

    if(!$content) {
      return '';
    }

    $a = shortcode_atts(array(
      'direction' => 'right'
    ), $atts);

    return '<div class="align-block align' . $a['direction'] . '">' . do_shortcode($content) . '</div>';

  }

}

new Vindig_Shortcodes();
