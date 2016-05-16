<!DOCTYPE html>
<html>
  <head>
    <title>Cartografia da violência contra os povos indígenas</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="fragment" content="!">
    <?php wp_head(); ?>
  </head>
  <body ng-controller="MainCtrl">
    <header id="masthead" ng-class="{collapsed: initialized}">
      <div class="header-main">
        <h1><a ui-sref="home" ng-click="home()"><?php bloginfo('name'); ?></a></h1>
        <nav class="button-nav"><a href="javascript:void(0);" ng-click="init();" ng-hide="initialized" class="button">Navegar pelos casos</a></nav>
      </div>
      <?php include_once(STYLESHEETPATH . '/views/filters.html'); ?>
      <nav id="mastnav" ng-class="{active: showNav}">
        <div class="nav-links">
          <a ng-click="toggleDossiers()" href="javascript:void(0);">Dossiês</a>
          <a ng-click="toggleDialog('embed')" href="javascript:void(0);" title="Incorporar no seu site"><span class="icon icon-share"></span></a>
          <a ng-click="toggleNav()" href="javascript:void(0);" title="Menu"><span class="icon icon-menu"></span></a>
        </div>
        <ul>
          <li ng-repeat="page in pages">
            <a ui-sref="home.page({id: page.ID})">{{page.title}}</a>
          </li>
          <li id="by">
            <h3>Um projeto de</h3>
            <a href="http://rosaluxspba.org/" target="_blank" rel="external"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/rosalux.jpg" /></a>
          </li>
          <li id="dossies" ng-class="{active: showDossiers}">
            <ul class="dossie-list">
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
      <aside id="intro" ng-hide="initialized">
        <p><?php bloginfo('description'); ?></p>
      </aside>
    </header>
    <div ui-view></div>
    <div id="embed-dialog" class="dialog" ng-show="showDialog('embed');">
      <div class="dialog-content">
        <a class="close" href="javascript:void(0);" ng-click="toggleDialog('embed');"><span class="icon icon-cross"></span></a>
        <h2>Incorpore a plataforma no seu site</h2>
        <p>Copie e cole o código abaixo para incorporar a visualização atual no seu site.</p>
        <textarea>&lt;iframe src=&quot;{{embedUrl}}&quot; width=&quot;100%&quot; height=&quot;600&quot; frameborder=&quot;0&quot;&gt;&lt;/iframe&gt;</textarea>
      </div>
    </div>
    <?php wp_footer(); ?>
  </body>
</html>
