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
      <nav id="mastnav">
        <a class="icon icon-menu" ng-click="toggleNav()"></a>
        <ul ng-show="showNav">
          <li ng-repeat="page in pages">
            <a ui-sref="page({id: page.ID})">{{page.title}}</a>
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
