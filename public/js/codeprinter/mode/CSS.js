/* CodePrinter - CSS Mode */

CodePrinter.defineMode('CSS', function() {
  
  function keyset(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) obj[arr[i]] = true;
    return obj;
  }
  
  var wordRgx = /[\w\-\\]/
  , operators = /[+>~^$|\*=]/
  , controls = /^(charset|document|font-face|import|(-(moz|ms|o|webkit|khtml)-)?keyframes|media|namespace|page|supports)\b/
  , unitsRgx = /^(%|p(x|t|c)|e(m|x)|m(s|m)|v(w|h|min|max|m)|rem|ch|s|in|cm)/
  , tags = [
    'html','body','div','a','ol','ul','li','span','p',
    'h1','h2','h3','h4','h5','h6','img','input','textarea',
    'button','form','label','select','option','optgroup',
    'main','nav','header','section','aside','footer','code',
    'fieldset','article','pre','table','tr','th','td',
    'thead','tbody','tfoot','frameset','frame','iframe'
  ]
  , colors = [
    'inherit', 'transparent', 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
    'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown',
    'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue',
    'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod',
    'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen',
    'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
    'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet',
    'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue', 'firebrick',
    'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite',
    'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'honeydew',
    'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
    'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
    'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightpink',
    'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
    'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta',
    'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
    'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
    'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
    'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered',
    'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred',
    'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue',
    'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown',
    'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue',
    'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan',
    'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white',
    'whitesmoke', 'yellow', 'yellowgreen', 'initial'
  ]
  , _colors = keyset(colors)
  , borderStyles = ['dashed', 'dotted', 'double', 'groove', 'hidden', 'inset', 'none', 'outset', 'ridge', 'solid', 'inherit']
  , borderWidths = ['medium', 'thin', 'thick', 'inherit']
  , overflows = ['auto', 'hidden', 'scroll', 'visible', 'inherit']
  , inherit = ['inherit']
  , hints = {
    'align-content':              ['center', 'flex-end', 'flex-start', 'space-around', 'space-between', 'stretch'],
    'align-items':                ['baseline', 'center', 'flex-end', 'flex-start', 'stretch'],
    'align-self':                 ['auto', 'baseline', 'center', 'flex-end', 'flex-start', 'stretch'],
    'animation':                  null,
    'animation-delay':            null,
    'animation-direction':        ['alternate', 'alternate-reverse', 'normal', 'reverse'],
    'animation-duration':         null,
    'animation-fill-mode':        ['backwards', 'both', 'forwards', 'none'],
    'animation-iteration-count':  ['infinite'],
    'animation-name':             ['none'],
    'animation-play-state':       ['paused', 'running'],
    'animation-timing-function':  ['ease', 'ease-in', 'ease-in-out', 'ease-out', 'linear', 'step-end', 'step-start', 'steps()'],
    'backface-visibility':        ['hidden', 'visible'],
    'background':                 null,
    'background-attachment':      ['fixed', 'local', 'scroll', 'inherit'],
    'background-blend-mode':      ['color', 'color-burn', 'color-dodge', 'darken', 'difference', 'exclusion', 'hard-light', 'hue', 'lighten', 'luminosity', 'normal', 'multiply', 'overlay', 'saturation', 'screen', 'soft-light'],
    'background-clip':            ['border-box', 'content-box', 'padding-box', 'inherit'],
    'background-color':           colors,
    'background-image':           ['image()', 'linear-gradient()', 'radial-gradient()', 'repeating-linear-gradient()', 'repeating-radial-gradient()', 'url()'],
    'background-origin':          ['border-box', 'content-box', 'padding-box', 'inherit'],
    'background-position':        ['left', 'center', 'right', 'bottom', 'top'],
    'background-repeat':          ['no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'round', 'space'],
    'background-size':            ['auto', 'contain', 'cover'],
    'border':                     [].concat(borderWidths, borderStyles, colors),
    'border-collapse':            ['collapse', 'separate', 'inherit'],
    'border-color':               colors,
    'border-spacing':             inherit,
    'border-style':               borderStyles,
    'border-bottom':              null,
    'border-bottom-color':        colors,
    'border-bottom-left-radius':  null,
    'border-bottom-right-radius': null,
    'border-bottom-style':        borderStyles,
    'border-bottom-width':        borderWidths,
    'border-image':               ['url()'],
    'border-image-outset':        null,
    'border-image-slice':         null,
    'border-image-source':        null,
    'border-image-repeat':        ['repeat', 'round', 'space', 'stretch'],
    'border-image-width':         ['auto'],  
    'border-left':                null,
    'border-left-color':          colors,
    'border-left-style':          borderStyles,
    'border-left-width':          borderWidths,
    'border-radius':              null,
    'border-right':               null,
    'border-right-color':         colors,
    'border-right-style':         borderStyles,
    'border-right-width':         borderWidths,
    'border-top':                 null,
    'border-top-color':           colors,
    'border-top-left-radius':     null,
    'border-top-right-radius':    null,
    'border-top-style':           borderStyles,
    'border-top-width':           borderWidths,
    'border-width':               borderWidths,
    'box-decoration-break':       null,
    'box-shadow':                 ['inset', 'outset'],
    'box-sizing':                 ['border-box', 'content-box', 'padding-box', 'inherit'],
    'bottom':                     ['auto', 'inherit'],
    'break-after':                ['always', 'auto', 'avoid', 'avoid-column', 'avoid-page', 'avoid-region', 'column', 'left', 'page', 'region', 'right'],
    'break-before':               ['always', 'auto', 'avoid', 'avoid-column', 'avoid-page', 'avoid-region', 'column', 'left', 'page', 'region', 'right'],
    'break-inside':               ['auto', 'avoid', 'avoid-column', 'avoid-page', 'avoid-region'],
    'caption-side':               ['bottom', 'top', 'inherit'],
    'clear':                      ['both', 'left', 'none', 'right', 'inherit'],
    'clip':                       ['auto', 'inherit'],
    'color':                      colors,
    'columns':                    null,
    'column-count':               null,
    'column-fill':                ['auto', 'balance'],
    'column-gap':                 ['normal'],
    'column-rule':                null,
    'column-rule-color':          colors,
    'column-rule-style':          borderStyles,
    'column-rule-width':          borderWidths,
    'column-span':                ['all', 'none'],
    'column-width':               ['auto', 'inherit'],
    'content':                    ['attr()', 'close-quote', 'no-close-quote', 'no-open-quote', 'normal', 'none', 'open-quote', 'inherit'],
    'counter-increment':          ['none', 'inherit'],
    'counter-reset':              ['none', 'inherit'],
    'cursor':                     ['alias', 'all-scroll', 'auto', 'cell', 'col-resize', 'context-menu', 'copy', 'crosshair', 'default', 'e-resize', 'ew-resize', 'grab', 'grabbing', 'help', 'inherit', 'move', 'n-resize', 'ne-resize', 'nesw-resize', 'no-drop', 'none', 'not-allowed', 'ns-resize', 'nw-resize', 'nwse-resize', 'pointer', 'progress', 'row-resize', 's-resize', 'se-resize', 'sw-resize', 'text', 'vertical-text', 'w-resize', 'wait', 'zoom-in', 'zoom-out'],
    'direction':                  ['ltr', 'rtl', 'inherit'],
    'display':                    ['block', 'flex', 'grid', 'inline', 'inline-block', 'inline-flex', 'inline-grid', 'inline-table', 'list-item', 'none', 'run-in', 'table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row', 'table-row-group', 'inherit'],
    'empty-cells':                ['hide', 'show', 'inherit'],
    'filter':                     ['blur()', 'brightness()', 'contrast()', 'custom()', 'drop-shadow()', 'grayscale()', 'hue-rotate()', 'invert()', 'none', 'opacity()', 'sepia()', 'saturate()', 'url()'],
    'flex':                       ['auto', 'initial', 'none'],
    'flex-basis':                 ['auto'],
    'flex-direction':             ['column', 'column-reverse', 'row', 'row-reverse'],
    'flex-flow':                  ['column', 'column-reverse', 'nowrap', 'row', 'row-reverse', 'wrap', 'wrap-reverse'],
    'flex-grow':                  null,
    'flex-shrink':                null,
    'flex-wrap':                  ['nowrap', 'wrap', 'wrap-reverse'],
    'float':                      ['left', 'right', 'none', 'inherit'],
    'flow-into':                  ['none'],
    'flow-from':                  ['none', 'inherit'],
    'font':                       inherit,
    'font-family':                ['cursive', 'fantasy', 'inherit', 'monospace', 'sans-serif', 'serif'],
    'font-feature-settings':      ['normal'],
    'font-kerning':               ['auto', 'none', 'normal'],
    'font-language-override':     ['normal'],
    'font-size':                  inherit,
    'font-size-adjust':           ['auto', 'inherit', 'none'],
    'font-stretch':               ['condensed', 'expanded', 'extra-condensed', 'extra-expanded', 'inherit', 'normal', 'semi-condensed', 'semi-expanded', 'ultra-condensed', 'ultra-expanded'],
    'font-style':                 ['inherit', 'italic', 'normal', 'oblique'],
    'font-synthesis':             ['none', 'style', 'weight'],
    'font-variant':               ['normal', 'small-caps', 'inherit'],
    'font-variant-alternates':    ['normal'],
    'font-variant-caps':          ['normal', 'small-caps', 'all-small-caps', 'petite-caps', 'all-petite-caps', 'unicase', 'titling-caps'],
    'font-variant-east-asian':    ['normal'],
    'font-variant-ligatures':     ['normal', 'none'],
    'font-variant-numeric':       ['normal'],
    'font-variant-position':      ['normal', 'sub', 'super'],
    'font-weight':                ['bold', 'bolder', 'inherit', 'lighter', 'normal', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    'height':                     ['auto', 'inherit'],
    'hyphens':                    ['auto', 'manual', 'none'],
    'image-orientation':          null,
    'image-resolution':           ['from-image', 'snap'],
    'justify-content':            ['center', 'flex-end', 'flex-start', 'space-around', 'space-between'],
    'left':                       ['auto', 'inherit'],
    'letter-spacing':             ['normal', 'inherit'],
    'line-height':                ['normal', 'inherit'],
    'list-style':                 ['armenian', 'circle', 'decimal', 'decimal-leading-zero', 'disc', 'georgian', 'inherit', 'inside', 'lower-alpha', 'lower-greek', 'lower-latin', 'lower-roman', 'none', 'outside', 'square', 'upper-alpha', 'upper-latin', 'upper-roman', 'url()'],
    'list-style-image':           ['none', 'url()', 'inherit'],
    'list-style-position':        ['inside', 'outside', 'inherit'],
    'list-style-type':            ['armenian', 'circle', 'decimal', 'decimal-leading-zero', 'disc', 'georgian', 'lower-alpha', 'lower-greek', 'lower-latin', 'lower-roman', 'none', 'square', 'upper-alpha', 'upper-latin', 'upper-roman', 'inherit'],
    'margin':                     ['auto', 'inherit'],
    'margin-bottom':              ['auto', 'inherit'],
    'margin-left':                ['auto', 'inherit'],
    'margin-right':               ['auto', 'inherit'],
    'margin-top':                 ['auto', 'inherit'],
    'max-height':                 ['none', 'inherit', 'initial'],
    'max-width':                  ['none', 'inherit', 'initial'],
    'min-height':                 inherit,
    'min-width':                  inherit,
    'object-fit':                 ['contain', 'cover', 'fill', 'none', 'scale-down'],
    'object-position':            ['left', 'center', 'right', 'bottom', 'top'],
    'opacity':                    inherit,
    'order':                      null,
    'orphans':                    inherit,
    'outline':                    inherit,
    'outline-color':              ['invert'].concat(colors),
    'outline-offset':             inherit,
    'outline-style':              borderStyles,
    'outline-width':              borderWidths,
    'overflow':                   overflows,
    'overflow-x':                 overflows,
    'overflow-y':                 overflows,
    'padding':                    inherit,
    'padding-bottom':             null,
    'padding-left':               null,
    'padding-right':              null,
    'padding-top':                null,
    'page-break-after':           ['always', 'auto', 'avoid', 'left', 'right', 'inherit'],
    'page-break-before':          ['always', 'auto', 'avoid', 'left', 'right', 'inherit'],
    'page-break-inside':          ['auto', 'avoid', 'inherit'],
    'perspective':                ['none'],
    'perspective-origin':         ['bottom', 'center', 'left', 'right', 'top'],
    'pointer-events':             ['all', 'auto', 'fill', 'inherit', 'none', 'painted', 'stroke', 'visible', 'visibleFill', 'visiblePainted', 'visibleStroke'],
    'position':                   ['absolute', 'fixed', 'relative', 'static', 'sticky', 'inherit'],
    'quotes':                     ['none', 'inherit'],
    'region-break-after':         ['always', 'auto', 'avoid', 'avoid-column', 'avoid-page', 'avoid-region', 'column', 'left', 'page', 'region', 'right'],
    'region-break-before':        ['always', 'auto', 'avoid', 'avoid-column', 'avoid-page', 'avoid-region', 'column', 'left', 'page', 'region', 'right'],
    'region-break-inside':        ['auto', 'avoid', 'avoid-column', 'avoid-page', 'avoid-region'],
    'region-fragment':            ['auto', 'break'],
    'resize':                     ['both', 'horizontal', 'none', 'vertical', 'inherit'],
    'right':                      ['auto', 'inherit'],
    'src':                        ['url()'],
    'shape-image-threshold':      null,
    'shape-inside':               ['auto', 'circle()', 'ellipse()', 'inherit', 'outside-shape', 'polygon()', 'rectangle()'],
    'shape-margin':               null,
    'shape-outside':              ['none', 'inherit', 'circle()', 'ellipse()', 'polygon()', 'inset()', 'margin-box', 'border-box', 'padding-box', 'content-box', 'url()', 'image()', 'linear-gradient()', 'radial-gradient()', 'repeating-linear-gradient()', 'repeating-radial-gradient()'],
    'table-layout':               ['auto', 'fixed', 'inherit'],
    'text-align':                 ['center', 'left', 'justify', 'right', 'inherit'],
    'text-align-last':            ['center', 'left', 'justify', 'right', 'inherit'],
    'text-decoration':            ['line-through', 'none', 'overline', 'underline', 'inherit'],
    'text-decoration-color':      colors,
    'text-decoration-line':       ['line-through', 'none', 'overline', 'underline'],
    'text-decoration-skip':       ['edges', 'ink', 'none', 'objects', 'spaces'],
    'text-decoration-style':      ['dashed', 'dotted', 'double', 'solid', 'wavy'],
    'text-emphasis':              null,
    'text-emphasis-color':        colors,
    'text-emphasis-position':     ['above', 'below', 'left', 'right'],
    'text-emphasis-style':        ['circle', 'dot', 'double-circle', 'filled', 'none', 'open', 'sesame', 'triangle'],
    'text-indent':                inherit,
    'text-overflow':              ['clip', 'ellipsis', 'inherit'],
    'text-shadow':                null,
    'text-rendering':             ['auto', 'geometricPrecision', 'optimizeLegibility', 'optimizeSpeed'],
    'text-transform':             ['capitalize', 'full-width', 'lowercase', 'none', 'uppercase', 'inherit'],
    'text-underline-position':    ['alphabetic', 'auto', 'below', 'left', 'right'],
    'top':                        ['auto', 'inherit'],
    'transform':                  ['matrix()', 'matrix3d()', 'none', 'perspective()', 'rotate()', 'rotate3d()', 'rotateX()', 'rotateY()', 'rotateZ()', 'scale()', 'scale3d()', 'scaleX()', 'scaleY()', 'scaleZ()', 'skewX()', 'skewY()', 'translate()', 'translate3d()', 'translateX()', 'translateY()', 'translateZ()'],
    'transform-origin':           ['bottom', 'center', 'left', 'right', 'top'],
    'transform-style':            ['flat', 'preserve-3d'],
    'transition':                 null,
    'transition-delay':           null,
    'transition-duration':        null,
    'transition-property':        ['all', 'none'],
    'transition-timing-function': ['ease', 'ease-in', 'ease-in-out', 'ease-out', 'linear', 'step-end', 'step-start', 'steps()'],
    'unicode-bidi':               ['bidi-override', 'embed', 'normal', 'inherit'],
    'unicode-range':              null,
    'user-select':                ['none', 'text', 'all', 'element'],
    'vertical-align':             ['baseline', 'bottom', 'middle', 'sub', 'super', 'text-bottom', 'text-top', 'top', 'inherit'],
    'visibility':                 ['collapse', 'hidden', 'visible', 'inherit'],
    'white-space':                ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'inherit'],
    'widows':                     inherit,
    'width':                      ['auto', 'inherit'],
    'word-break':                 ['normal', 'break-all', 'keep-all', 'inherit'],
    'word-spacing':               ['normal', 'inherit'],
    'word-wrap':                  ['break-word', 'normal', 'inherit'],
    'z-index':                    ['auto', 'inherit']
  }
  , properties = Object.keys(hints)
  , symbols = {
    '#': 'special',
    '.': 'property'
  }
  
  function string(stream, state, escaped) {
    var esc = !!escaped, ch;
    while (ch = stream.next()) {
      if (ch == state.quote && !esc) break;
      if (esc = !esc && ch == '\\') {
        stream.undo(1);
        state.next = escapedString;
        return 'string';
      }
    }
    if (!ch && esc) state.next = string;
    state.next = null;
    if (!ch) return 'invalid';
    state.quote = undefined;
    return 'string';
  }
  function escapedString(stream, state) {
    if (stream.eat('\\')) {
      var ch = stream.next();
      if (ch) {
        state.next = string;
        return 'escaped';
      }
      stream.undo(1);
    }
    return string(stream, state, true);
  }
  function comment(stream, state) {
    if (stream.skip('*/', true)) {
      state.next = undefined;
      return 'comment';
    }
    stream.skip();
    state.next = comment;
    return 'comment';
  }
  function attribute(stream, state) {
    state.next = undefined;
    var ch = stream.next();
    if (/[a-z]/i.test(ch)) {
      stream.eatWhile(/[\w\-]/);
      return 'parameter';
    }
    stream.undo(1);
    return;
  }
  function vardef(stream, state) {
    stream.match(/^\s*/, true);
    stream.eat(':');
    state.next = undefined;
    if (stream.eol()) state.vardef = undefined;
    return;
  }
  function getUnprefixedProperty(prop) {
    var m = /^(\-(webkit|moz|ms|o|khtml)\-)?([\w\-]+)$/.exec(prop);
    return m && m[3];
  }
  
  function Definition(name) {
    this.name = name;
  }
  Definition.prototype.toString = function() {
    return this.name;
  }
  
  return new CodePrinter.Mode({
    name: 'CSS',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    indentTriggers: /\}/,
    autoCompleteWord: /@?[\w\-\\]+/,
    autoCompleteTriggers: /[:@]/,
    matching: 'brackets',
    
    initialState: function() {
      return { vars: {}, indent: 0 }
    },
    iterator: function(stream, state) {
      if (stream.pos == 0 && state.vardef) state.vardef = undefined;
      var ch = stream.next();
      if (state.property || state.vardef) {
        if (ch == '-' || /\d/.test(ch)) {
          if (stream.match(/^\d*\.?\d+/, true) || /\d/.test(ch)) {
            stream.match(unitsRgx, true);
            return 'numeric';
          }
          return;
        }
        if (ch == '.') {
          stream.match(/^\d+/, true);
          stream.match(unitsRgx, true);
          return 'numeric';
        }
        if (ch == '#') {
          var hex = ch + stream.eatWhile(/[0-9a-f]/i);
          return hex.length == 4 || hex.length == 7 ? 'numeric hex' : 'invalid';
        }
        if (ch == '@') {
          var word = ch + stream.eatWhile(wordRgx);
          if (state.vars[word] === true) {
            return 'variable';
          }
          return 'invalid';
        }
      } else {
        if (symbols[ch]) {
          stream.eatWhile(wordRgx);
          return symbols[ch];
        }
        if (ch == '@') {
          if (stream.match(controls, true)) {
            return 'control';
          } else {
            var word = ch + stream.eatWhile(wordRgx);
            if (stream.isAfter(/^\s*:/)) {
              state.vars[word] = true;
              state.next = vardef;
              state.vardef = word;
            }
            return 'variable';
          }
        }
        if (ch == '*') {
          return 'keyword';
        }
        if (ch == '[') {
          state.next = attribute;
          return;
        }
      }
      if (ch == '{') {
        if (stream.lastStyle) stream.markDefinition(new Definition(stream.value.substr(0, stream.pos - 1)));
        ++state.indent;
        return 'bracket';
      }
      if (ch == '}') {
        if (state.property) state.property = undefined;
        if (state.vardef) state.vardef = undefined;
        --state.indent;
        return 'bracket';
      }
      if (ch == '(' || ch == ')') {
        return 'bracket';
      }
      if (ch == ';') {
        if (state.property) state.property = undefined;
        if (state.vardef) state.vardef = undefined;
        return;
      }
      if (ch == ':' && !state.property) {
        stream.eatWhile(wordRgx);
        return 'namespace';
      }
      if (ch == '/' && stream.eat('*')) {
        return comment(stream, state);
      }
      if (ch == '"' || ch == "'") {
        state.quote = ch;
        return string(stream, state);
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/\d/);
        stream.eat('%');
        return 'numeric';
      }
      if (ch == '<' && state.parser && stream.isAfter(/^\s*\/\s*style/i)) {
        state.parser = undefined;
        stream.undo(1);
        return;
      }
      if (operators.test(ch)) {
        stream.eatWhile(operators);
        return 'operator';
      }
      if (wordRgx.test(ch)) {
        var word = ch + stream.eatWhile(wordRgx);
        if (tags.indexOf(word) >= 0) {
          return 'keyword';
        }
        if ((state.property || state.vardef) && _colors[word] === true) {
          return 'keyword css-color';
        }
        if (stream.isAfter(/^\s*\(/)) {
          return 'function';
        }
        if (state.property) {
          var prop = getUnprefixedProperty(state.property);
          if (hints[prop] && hints[prop].indexOf(word) >= 0) {
            return 'keyword';
          }
        }
        if (state.indent > 0) {
          var prop = word;
          if (ch == '-') {
            prop = getUnprefixedProperty(word);
          }
          if (stream.isAfter(/^\s*:/)) state.property = word;
          if (prop && hints.hasOwnProperty(prop)) {
            return 'special';
          }
          return 'word';
        }
        return 'property';
      }
      return;
    },
    indent: function(stream, state) {
      if (stream.lastValue == '{' && stream.isAfter(/^\s*\}/)) {
        return [state.indent, -1];
      }
      if (stream.isAfter(/^\s*\}/) || state.parser && stream.isAfter(/^\s*<\s*\/\s*style/i)) return state.indent - 1;
      return state.indent;
    },
    completions: function(stream, state) {
      if (stream.isBefore(/@[\w\-\\]*$/)) {
        return Object.keys(state.vars);
      }
      if (state.property && /(\-\w+\-)?(\w[\w\-]*)/.test(state.property)) {
        return hints[RegExp.$2] || [];
      }
      if (stream.isBefore(/(^|\W)\-(we|mo|ms|o)[\w\-]*$/)) {
        var prefix = RegExp.$2, v = [];
        
        if (prefix == 'we') {
          prefix = 'webkit';
        } else if (prefix == 'mo') {
          prefix = 'moz';
        }
        for (var i = 0; i < properties.length; i++) {
          v.push('-'+prefix+'-'+properties[i]);
        }
        return v;
      }
      if (state.vardef) {
        return colors;
      }
      return state.indent ? properties : tags;
    },
    onCompletionChosen: function(choice) {
      var choice = choice.replace(/^\-(webkit|moz|ms|o)\-/, '');
      if (hints.hasOwnProperty(choice) && !/\:[^\:]*$/.test(this.caret.textBefore())) {
        this.insertText(': ;', -1);
        return true;
      } else if (/\(\)$/.test(choice)) {
        this.caret.moveX(-1);
      }
    },
    keyMap: {
      ':': function(stream, state) {
        if (!stream.isBefore(':') && !stream.isAfter(';') && stream.lastStyle == 'special') {
          this.insertText(': ;', -1);
          return false;
        }
      },
      ';': function(stream, state) {
        if (stream.isAfter(';')) {
          this.caret.moveX(1);
          return false;
        }
      }
    }
  });
});