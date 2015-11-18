CodePrinter.defineAddon('hints', function() {
  
  var defaults = {
    word: /[\w\-$]+/,
    range: 500,
    limit: 100,
    maxWidth: 300,
    maxHeight: 100
  }
  , li_clone = document.createElement('li');
  
  var Hints = function(cp, options) {
    var that = this, ov, active, container, visible, curWord;
    
    this.options = options = {}.extend(defaults, options);
    cp.hints = this;
    
    this.overlay = ov = cp.createOverlay('cp-hint-overlay');
    container = document.createElement('div');
    container.className = 'cp-hint-container';
    ov.node.appendChild(container);
    
    if (options.maxWidth != 300) container.style.maxWidth = options.maxWidth + 'px';
    if (options.maxHeight != 100) container.style.maxHeight = options.maxHeight + 'px';
    
    function getWordRgx() {
      return cp.doc.parser.autoCompleteWord || options.word || defaults.word;
    }
    
    this.search = function() {
      var list = [], seen = {}
      , range = options.range, limit = options.limit
      , wordRgx = getWordRgx()
      , rgx = new RegExp(wordRgx.source, 'g')
      , wordBf = cp.wordBefore(wordRgx)
      , wordAf = cp.wordAfter(wordRgx)
      , caret = cp.caret
      , curDL = caret.dl()
      , bf = caret.textBefore()
      , af = caret.textAfter()
      , text = curDL.text
      , s = cp.getStateAt(curDL, bf.length)
      , parser = s && s.state && s.state.parser || cp.doc.parser
      , dl, text, m
      , next, hOP, fn, ph;
      
      curWord = (wordBf + wordAf).toLowerCase();
      hOP = Object.prototype.hasOwnProperty;
      
      fn = curWord ? function(match) {
        var o = 0, m = 0, max = 0, p = 0
        , l = curWord.length
        , lc = match.toLowerCase();
        
        for (var i = 0, l = curWord.length; i < l; i++) {
          var j = lc.indexOf(curWord[i], o);
          if (j == o) {
            ++o;
            max = Math.max(++m, max);
          } else if (j > 0) {
            m = 1 - j/lc.length;
            o = j+1;
          } else {
            p += 1 - i/l;
            m = 0;
          }
        }
        if (max >= Math.sqrt(l)) {
          seen[match] = max - p;
          list.push(match);
        } else {
          seen[match] = null;
        }
      }
      : function(match) {
        seen[match] = true;
        list.push(match);
      }
      
      function loop() {
        while (m = rgx.exec(text)) {
          if (!hOP.call(seen, m[0])) {
            fn(m[0]);
          }
        }
      }
      
      if (parser && parser.completions && (ph = parser.completions.call(cp, s.stream, s.state))) {
        var v = ph instanceof Array ? ph : ph.values;
        for (var i = 0; i < v.length; i++) {
          if (!hOP.call(seen, v[i])) {
            fn(v[i]);
          }
        }
        if ('number' === typeof ph.search && ph.search > 1) {
          range = ph.search;
        }
      }
      if (!ph || ph.search) {
        text = curWord ? bf.substr(0, bf.length - wordBf.length) + ' ' + af.substr(wordAf.length) : bf + af;
        loop();
        
        for (var dir = 0; dir <= 1; dir++) {
          next = dir ? curDL.next : curDL.prev;
          dl = next.call(curDL);
          
          for (var i = 1; i < range && dl && list.length < limit; i++) {
            text = dl.text;
            loop();
            dl = next.call(dl);
          }
          limit = limit * 2;
        }
      }
      return curWord ? list.sort(function(a, b) { return seen[b] - seen[a]; }) : list;
    }
    this.show = function(autocomplete, byWord) {
      var list = this.search(byWord), ul;
      
      container.innerHTML = '<ul></ul>';
      ul = container.firstChild;
      
      if (list.length) {
        if (list.length == 1 && autocomplete !== false) {
          return this.choose(list[0]);
        }
        for (var i = 0; i < list.length; i++) {
          var li = li_clone.cloneNode();
          li.innerHTML = list[i];
          ul.appendChild(li);
        }
        this.overlay.reveal();
        refreshPosition();
        setActive(ul.children[0], true);
        visible = true;
      } else {
        this.hide();
      }
      return this;
    }
    this.hide = function() {
      ov.remove();
      visible = active = undefined;
      return that;
    }
    this.isVisible = function() {
      return !!visible;
    }
    this.choose = function(value) {
      var word = getWordRgx()
      , wbf = cp.wordBefore(word)
      , waf = cp.wordAfter(word)
      , parser = cp.getCurrentParser();
      
      if (wbf + waf !== value) {
        cp.removeBeforeCursor(wbf);
        cp.removeAfterCursor(waf);
        cp.insertText(value);
      } else {
        cp.caret.moveX(waf.length);
      }
      if (parser && parser.onCompletionChosen) {
        if (parser.onCompletionChosen.call(cp, value)) {
          $.async(function() {
            that.show(false);
          });
        }
      }
      cp.emit('autocomplete', value);
      return this;
    }
    
    cp.on({
      '[Up]': function(e) {
        if (visible) {
          var last = container.children[0].lastChild;
          setActive(active && active.prev() || last, true);
          return e.cancel();
        }
      },
      '[Down]': function(e) {
        if (visible) {
          var first = container.children[0].firstChild;
          setActive(active && active.next() || first, true);
          return e.cancel();
        }
      },
      '[Enter]': function(e) {
        if (visible && active) {
          that.choose(active.innerHTML);
          that.hide();
          return e.cancel();
        }
      },
      '[Esc]': function(e) {
        if (visible) {
          that.hide();
          return e.cancel();
        }
      }
    });
    
    cp.registerKey({
      'Ctrl Space': function() {
        this.hints.show();
      }
    });
    
    ov.on({
      'caretMoved': function() {
        if (curWord) {
          var wordRgx = getWordRgx()
          , word = cp.wordBefore(wordRgx) + cp.wordAfter(wordRgx);
          
          if (word && word === curWord) {
            that.show(false, word);
          } else {
            that.hide();
          }
        }
      },
      'changed': function(e) {
        !e.added || that.strictMatch(e.text) ? that.show(false) : that.hide();
      },
      'keydown': function() {
        curWord = undefined;
      },
      'blur': that.hide,
      'click': that.hide
    });
    
    var stopprop = function(e) { e.stopPropagation(); };
    ov.node.addEventListener('wheel', stopprop, false);
    ov.node.addEventListener('mousewheel', stopprop, false);
    ov.node.addEventListener('DOMMouseScroll', stopprop, false);
    
    container.addEventListener('mousedown', function(e) {
      if (e.target.tagName == 'LI') {
        that.choose(e.target.innerHTML);
        that.hide();
        e.stopPropagation();
        return false;
      }
    }, false);
    container.addEventListener('mouseover', function(e) {
      if (e.target.tagName == 'LI') setActive(e.target);
    }, false);
    container.addEventListener('mouseout', function(e) {
      if (e.target.tagName == 'LI') setActive(null);
    }, false);
    
    function refreshPosition() {
      var x = cp.caret.offsetX() - 4
      , y = cp.caret.totalOffsetY(true) + cp.sizes.paddingTop + 2;
      
      if (y + container.offsetHeight > cp.wrapper.offsetHeight) {
        y = cp.caret.totalOffsetY() - container.offsetHeight - 2;
      }
      if (x + container.offsetWidth > cp.wrapper.offsetWidth) {
        x = x - container.offsetWidth;
      }
      
      container.style.top = y+'px';
      container.style.left = x+'px';
    }
    function setActive(li, scroll) {
      if (active) active.removeClass('active');
      if (li) {
        active = li.addClass('active');
        if (scroll) container.scrollTop = scrollTop(li);
      } else {
        active = null;
      }
    }
    function scrollTop(li) {
      var ot = li.offsetTop, st = container.scrollTop, loh = li.offsetHeight, ch = container.clientHeight;
      return ot < st ? ot : ot + loh < st + ch ? st : ot - ch + loh;
    }
    return this;
  }
  
  Hints.prototype = {
    setRange: function(range) {
      this.options.range = range;
    },
    setWordPattern: function(word) {
      this.options.word = word;
    },
    match: function(word) {
      return this.options.word.test(word);
    },
    strictMatch: function(word) {
      return new RegExp('^'+this.options.word.source+'$').test(word);
    }
  }
  
  return Hints;
});