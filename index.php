<!DOCTYPE html>
<html>
  <head>
    <title><?php bloginfo('name'); ?></title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="fragment" content="!">
    <?php wp_head(); ?>
  </head>
  <body ng-controller="MainCtrl">
    <header id="masthead" ng-class="{collapsed: initialized}">
      <div class="header-main">
        <h1><a ui-sref="home" ng-click="home()">C<span>A</span>CI</a></h1>
        <aside id="intro" ng-hide="initialized">
          <p><?php bloginfo('description'); ?></p>
        </aside>
        <nav class="button-nav"><a href="javascript:void(0);" ng-click="init();" ng-hide="initialized" class="button">Acesse</a></nav>
      </div>
      <?php //include_once(STYLESHEETPATH . '/views/filters.html'); ?>
      <nav id="mastnav" ng-class="{active: showNav}">
        <div class="nav-links">
          <a ng-click="toggleDossiers()" href="javascript:void(0);" ng-show="initialized">Dossiês</a>
          <a ng-click="toggleDialog('embed')" href="javascript:void(0);" title="Incorporar no seu site"><span class="icon icon-share"></span></a>
          <a ng-click="toggleNav()" href="javascript:void(0);" title="Menu"><span class="icon icon-menu"></span></a>
        </div>
        <ul>
          <li ng-repeat="page in pages">
            <a ui-sref="home.page({id: page.ID})">{{page.title}}</a>
          </li>
          <li id="by">
            <h3>Desenvolvido por</h3>
            <div class="logos clearfix">
              <a href="http://rosaluxspba.org/" target="_blank" rel="external"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/rosalux.jpg" /></a>
              <a href="http://armazemmemoria.com.br" target="_blank" rel="external"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/armz_memoria.jpg" /></a>
              <a href="http://infoamazonia.org" target="_blank" rel="external"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/infoamazonia.png" /></a>
            </div>
            <p>Esta plataforma foi realizada com o apoio da Fundação Rosa Luxemburgo com fundos do Ministério Federal para a Cooperação Econômica e de Desenvolvimento da Alemanha (BMZ)</p>
          </li>
          <li id="dossies" ng-class="{active: showDossiers && !showNav}">
            <ul class="dossie-list clearfix">
              <li ng-repeat="dossier in dossiers">
                <div style="background-image:url({{dossier.featured_image.attachment_meta.sizes.large.url}});" class="image"></div>
                <article>
                  <h3><a ui-sref="home.dossier({dossierId: dossier.ID})">{{dossier.title}}</a></h3>
                </article>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <div ui-view></div>
    <div id="embed-dialog" class="dialog" ng-show="showDialog('embed');">
      <div class="dialog-content">
        <a class="close" href="javascript:void(0);" ng-click="toggleDialog('embed');"><span class="icon icon-cross"></span></a>
        <h2>Incorpore a plataforma no seu site</h2>
        <p>Copie e cole o código abaixo para incorporar a visualização atual no seu site.</p>
        <textarea>&lt;iframe src=&quot;{{embedUrl}}&quot; width=&quot;100%&quot; height=&quot;600&quot; frameborder=&quot;0&quot;&gt;&lt;/iframe&gt;</textarea>
        <div class="social">
          <h3>Compartilhe sua navegação nas redes sociais</h3>
          <p>
            <a class="icon show-if-mobile" ng-href="whatsapp://send?text={{getEmbedUrl()}}" data-action="share/whatsapp/share">
              <img ng-src="{{base}}/img/whatsapp.png" />
            </a>
            <a ng-href="https://www.facebook.com/sharer/sharer.php?u={{getEmbedUrl()}}" class="icon icon-facebook" rel="external" target="_blank"></a>
            <a ng-href="https://twitter.com/home?status={{getEmbedUrl()}}" class="icon icon-twitter" rel="external" target="_blank"></a>
          </p>
        </div>
      </div>
    </div>
    <?php wp_footer(); ?>
  </body>
</html>
