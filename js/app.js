!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){!function(a){b.exports=function(a){a.controller("MainCtrl",["$scope",function(a){a.init=function(){a.initialized=!0}}]),a.controller("HomeCtrl",["$scope","Casos",function(a,b){a.casos=b.data,console.log(a.casos)}])}}()},{}],2:[function(a,b,c){!function(a,c){a.mapbox.accessToken="pk.eyJ1IjoiaW5mb2FtYXpvbmlhIiwiYSI6InItajRmMGsifQ.JnRnLDiUXSEpgn7bPDzp7g",b.exports=function(b){b.directive("map",[function(){return{restrict:"E",link:function(b,c,d){angular.element(c).append('<div id="'+d.id+'"></div>').attr("id","");var e=a.map(d.id,{center:[-9.107747,-58.103348],zoom:5}),f={baseLayer:a.mapbox.tileLayer("infoamazonia.8d20fc32"),baltimetria:a.mapbox.tileLayer("infoamazonia.naturalEarth_baltimetria"),rivers:a.mapbox.tileLayer("infoamazonia.rivers"),treecover:a.mapbox.tileLayer("infoamazonia.4rbe1sxe"),streets:a.mapbox.tileLayer("infoamazonia.osm-brasil")};for(var g in f)e.addLayer(f[g]);var h={"Unidades de Conservação":a.mapbox.tileLayer("infoamazonia.ojdsix43"),"Terras indígenas":a.mapbox.tileLayer("infoamazonia.qwbaban8"),Desmatamento:a.mapbox.tileLayer("infoamazonia.9by7k878")};a.control.layers({},h).addTo(e)}}}])}}(window.L)},{}],3:[function(a,b,c){!function(){b.exports=function(a){a.filter("casoName",[function(){return function(a){var b="";return a&&(a.NOME?(b+=a.NOME,a.APELIDO&&(b+=" ("+a.APELIDO+")")):b+=a.APELIDO?a.APELIDO:"Não identificado",a.IDADE&&(b+=", "+a.IDADE+" anos")),b}}])}}()},{}],4:[function(a,b,c){!function(b,c){var d=b.module("vindigena",["ui.router"]);d.config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,c,d,e){d.html5Mode({enabled:!1,requireBase:!1}),d.hashPrefix("!"),a.state("home",{url:"/",controller:"HomeCtrl",resolve:{Casos:["Vindig",function(a){return a.cases()}]}}),c.rule(function(a,c){var d,e=c.path(),f=c.search();if("/"!==e[e.length-1])return 0===Object.keys(f).length?e+"/":(d=[],b.forEach(f,function(a,b){d.push(b+"="+a)}),e+"/?"+d.join("&"))})}]),a("./services")(d),a("./filters")(d),a("./directives")(d),a("./controllers")(d),b.element(document).ready(function(){b.bootstrap(document,["vindigena"])})}(window.angular)},{"./controllers":1,"./directives":2,"./filters":3,"./services":5}],5:[function(a,b,c){!function(a){b.exports=function(b){b.factory("Vindig",["$http",function(b){return{cases:function(){return b.get(a.api+"posts?type=case")},dossiers:function(){return b.get(a.api+"posts?type=dossier")}}}])}}(vindig)},{}]},{},[4]);
//# sourceMappingURL=app.js.map