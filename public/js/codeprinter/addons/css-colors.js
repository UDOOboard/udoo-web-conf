CodePrinter.defineAddon('css-colors', function() {
  
  function is(node, className) {
    return node.className.indexOf(className) >= 0;
  }
  
  return function(cp, options) {
    var prop = options && options.property || 'color';
    
    cp.wrapper.addEventListener('mouseover', function(e) {
      var target = e.target;
      if (target.tagName == 'SPAN') {
        if (is(target, 'cpx-hex')) {
          var html = target.innerHTML;
          if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(html)) {
            target.style[prop] = html;
          }
        } else if (is(target, 'cpx-css-color')) {
          var html = target.innerHTML;
          if (/^[a-z\-]+$/i.test(html)) {
            target.style[prop] = html;
          }
        }
      }
    }, false);
    cp.wrapper.addEventListener('mouseout', function(e) {
      if (e.target.tagName == 'SPAN' && (is(e.target, 'cpx-hex') || is(e.target, 'cpx-css-color'))) {
        e.target.style.removeProperty(prop);
      }
    }, false);
  }
});