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
        <h1><a ui-sref="home"><?php bloginfo('name'); ?></a></h1>
        <nav id="mastnav"><a href="#" ng-click="init();" ng-hide="initialized" class="button">Navegar pelos casos</a></nav>
      </div>
      <aside id="intro" ng-hide="initialized">
        <p>De 1984 até hoje foram registrados <span class="number-1">1234 </span>casos de homícidio praticados contra a população indígena no Brasil</p>
      </aside>
    </header>
    <section id="dossies" ng-class="{collapsed: initialized}">
      <h2>Dossiês</h2>
      <ul class="dossie-list">
        <li>
          <div style="background-image:url(http://lorempixum.com/500/500/?1)" class="image"></div>
          <article>
            <h3><a>Assassinatos em Antonio João - MS</a></h3>
          </article>
        </li>
        <li>
          <div style="background-image:url(http://lorempixum.com/500/500/?2)" class="image"></div>
          <article>
            <h3><a>Assassinatos nas regiões dos processos do STF (MS)</a></h3>
          </article>
        </li>
        <li>
          <div style="background-image:url(http://lorempixum.com/500/500/?3)" class="image"></div>
          <article>
            <h3><a>Extermínio para tomada de terra por mineradora no Pará</a></h3>
          </article>
        </li>
        <li>
          <div style="background-image:url(http://lorempixum.com/500/500/?4)" class="image"></div>
          <article>
            <h3><a>Presídio Krenak ­Fluxo de prisões.</a></h3>
          </article>
        </li>
      </ul>
    </section>
    <section id="content" ui-view autoscroll="false">
      <section id="casos">
        <ul ng-show="casos.length &amp;&amp; initialized" class="caso-list">
          <li ng-repeat="caso in casos | limitTo:100" class="clearfix">
            <article>
              <div class="location">
                <span class="icon icon-pin"></span>
                <p class="location-info" ng-bind-html="caso | caseLocation">
              </div>
              <div class="date">
                <span class="icon icon-calendar"></span>
                <p class="date-info" ng-bind-html="caso | casoDate"></p>
              </div>
              <h3>{{caso | casoName}}</h3>
              <p>{{caso.descricao}}</p>
              <p class="source" ng-show="caso.fonte_cimi">Fonte: {{caso.fonte_cimi}}</p>
            </article>
          </li>
        </ul>
      </section>
    </section>
    <div class="map-container"><map id="map" markers="casos | postToMarker"></map></div>
    <?php wp_footer(); ?>
  </body>
</html>
