CodePrinter.defineAddon('findbar', function() {
  
  var Findbar = function(cp, options) {
    var that = this
    , bar = document.createElement('div')
    , input = document.createElement('input')
    , next = document.createElement('button')
    , prev = document.createElement('button')
    , inf = document.createElement('span');
    
    bar.className = 'cp-findbar';
    input.type = 'text';
    prev.innerHTML = 'Prev';
    next.innerHTML = 'Next';
    
    bar.appendChild(prev);
    bar.appendChild(next);
    bar.appendChild(input);
    bar.appendChild(inf);
    
    this.show = function() {
      cp.mainNode.appendChild(bar);
      input.focus();
    }
    this.hide = function() {
      cp.searchEnd();
      cp.mainNode.removeChild(bar);
    }
    this.next = function() {
      cp.searchNext();
    }
    this.prev = function() {
      cp.searchPrev();
    }
    
    next.onclick = this.next;
    prev.onclick = this.prev;
    
    input.addEventListener('keydown', function(e) {
      if (e.keyCode == 13) {
        cp.search(input.value);
        return cancel(e);
      }
      if (e.keyCode == 27) {
        that.hide();
        return cancel(e);
      }
    }, false);
    
    cp.on('searchCompleted', function(find, length) {
      inf.innerHTML = (length || 'No')+' matches';
    });
    
    cp.keyMap['Ctrl F'] = this.show;
  }
  
  function cancel(e) {
    e.preventDefault();
    e.stopPropagation();
    return e.returnValue = false;
  }
  
  return Findbar;
});