# Angular FitVids

This project is an [AngularJS](http://angularjs.org) port of [FitVids](https://github.com/davatron5000/FitVids.js) from [@davatron5000](https://twitter.com/davatron5000) and [@chriscoyier](https://twitter.com/chriscoyier). This exists to allow AngularJS users access to responsive video support through FitVids without requiring jQuery.

# Browser Support

Has been loosely tests on the latest versions of Chrome and Firefox as well IE8+. Browsers must support `document.querySelectorAll` for it to work.

# Usage

For overall usage please see FitVids. Works with AngularJS v1.2.0 and above.

```html
<script src="/path/to/angular.min.js"></script>
<script src="path/to/angular-fitvids.js"></script>
<script type="text/javascript">
    var App = angular.module('App', ['fitVids']);
</script>

<!-- Video in your <body> -->
<div fit-vids>
    <iframe width="425" height="349" src="http://www.youtube.com/embed/FKWwdQu6_ok" frameborder="0" allowfullscreen></iframe>
</div>
```

Custom selector support exists like so

```html
<div fit-vids custom-selector="iframe[src^='http://socialcam.com']">
    <iframe width="520px" height="391px" src="http://socialcam.com/videos/XRMP3Y5t/embed?utm_campaign=web&utm_source=embed" frameborder="0" allowfullscreen></iframe>
</div>
```
