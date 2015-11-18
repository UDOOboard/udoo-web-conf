CodePrinter.defineAddon('scrollbars', function() {
  
  var Scrollbars = function(cp) {
    var x = new Scrollbar(cp, 'horizontal')
    , y = new Scrollbar(cp, 'vertical');
    
    this.update = function(show) {
      x.update(show);
      y.update(show);
    }
    this.show = function() {
      x.show();
      y.show();
    }
    this.hide = function() {
      if (!this.options.alwaysVisible) {
        x.hide();
        y.hide();
      }
    }
  }
  
  var Scrollbar = function(cp, type) {
    var div = document.createElement('div')
    , slider = document.createElement('div')
    , dim, dir;
    
    if (type === 'vertical') {
      dim = 'Height';
      dir = 'Top';
    } else {
      dim = 'Width';
      dir = 'Left';
    }
    
    div.className = 'cp-scrollbar cp-scrollbar-'+type;
    slider.className = 'cp-scrollbar-slider';
    div.appendChild(slider);
    
    cp.container.appendChild(div);
    
    this.update = function(show) {
      var m = div['offset'+dim] - 4
      , c = cp.wrapper['offset'+dim]
      , sm = cp.wrapper['scroll'+dim]
      , sr = cp.wrapper['scroll'+dir]
      , s = parseInt(m * Math.sqrt(sm / c) * c / sm, 10);
      
      if (sm > c) {
        show !== false && this.show();
        slider.style[dim.toLowerCase()] = s + 'px';
        slider.style[dir.toLowerCase()] = parseInt((m - s) * sr / (sm - c), 10) + 'px';
      } else {
        this.hide();
      }
    }
    this.show = function() {
      div.className += ' visible';
    }
    this.hide = function() {
      div.className = div.className.replace(/ visible/g, '');
    }
  }
  
  Scrollbars.defaults = {
    alwaysVisible: false
  }
  
  return function(cp, options) {
    if (!cp.scrollbars) {
      var sb = cp.scrollbars = new Scrollbars(cp);
      
      sb.options = { alwaysVisible: false };
      for (var k in options) sb.options[k] = options[k];
      
      if (cp.caret.isActive) {
        sb.update(false);
      }
      
      cp.on({
        'scroll': function() {
          sb.update();
        },
        'scrollend': function() {
          if (!sb.options.alwaysVisible) {
            sb.hide();
          }
        }
      });
    }
  }
});