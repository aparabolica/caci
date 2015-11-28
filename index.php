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
      <nav id="mastnav" ng-class="{active: showNav}">
        <a class="icon icon-menu" ng-click="toggleNav()" href="javascript:void(0);"></a>
        <ul>
          <li ng-repeat="page in pages">
            <a ui-sref="home.page({id: page.ID})">{{page.title}}</a>
          </li>
          <li id="by">
            <h3>Um projeto de</h3>
            <a href="http://rosaluxspba.org/" target="_blank" rel="external"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/rosalux.jpg" /></a>
          </li>
          <li id="share">
            <ul class="share-list row">
              <li><a class="icon icon-facebook" href="http://facebook.com/" target="_blank" rel="external"></a></li>
              <li><a class="icon icon-twitter" href="http://twitter.com/" target="_blank" rel="external"></a></li>
            </ul>
          </li>
          <li id="dossies">
            <h2>Dossiês</h2>
            <ul class="dossie-list">
              <li ng-repeat="dossier in dossiers">
                <div style="background-image:url({{dossier.featured_image.attachment_meta.sizes.large.url}});" class="image"></div>
                <article>
                  <h3><a ui-sref="home.dossier({id: dossier.ID})">{{dossier.title}}</a></h3>
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
    <?php wp_footer(); ?>
  </body>
</html>
