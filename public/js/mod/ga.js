(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window, window.document, 'script', '/js/mod/gasrc.js', 'ga');
window.ga('create', 'UA-56247637-1', 'auto');

exports.send = function(event) {
  window.ga('send', event || 'pageview');
}

exports.ga = function() {
  return window.ga
}