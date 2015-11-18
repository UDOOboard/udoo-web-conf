/* CodePrinter - CoffeeScript Mode */

CodePrinter.defineMode('CoffeeScript', function() {
  
  var wordRgx = /[\w$\xa1-\uffff]/
  , numericRgx = /^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/
  , operatorRgx = /[+\-*&%=<>!?|~^]/
  , controls = ['if','else','elseif','then','for','switch','while','until','do','try','catch','finally']
  , booleans = /^(true|false|yes|no|o(n|ff))$/
  , constants = /^(null|undefined|NaN|Infinity)$/
  , operators = /^(is(nt)?|not|and|or|xor)$/
  , keywords = [
    'var','return','new','continue','break','instanceof','typeof','case','let','debugger',
    'default','delete','in','throw','void','with','const','of','import','export','module'
  ]
  , specials = [
    'this','window','document','console','arguments','function',
    'Object','Array','String','Number','Function','RegExp','Date','Boolean','Math','JSON',
    'Proxy','Map','WeakMap','Set','WeakSet','Symbol',
    'Error','EvalError','InternalError','RangeError','ReferenceError',
    'StopIteration','SyntaxError','TypeError','URIError'
  ];
  
  function string(stream, state, escaped) {
    var esc = !!escaped, ch;
    while (ch = stream.next()) {
      if (ch == state.quote && !esc) break;
      if (esc = !esc && ch == '\\') {
        stream.undo(1);
        state.next = escapedString;
        return 'string';
      }
      if (ch == '#' && stream.peek() == '{') {
        state.next = interpolation;
        stream.undo(1);
        return 'string';
      }
    }
    if (!ch && esc) state.next = string;
    else state.next = null;
    if (!ch) return 'invalid';
    state.quote = null;
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
  function interpolation(stream, state) {
    var ch = stream.next();
    if (ch == '#' && stream.eat('{')) {
      if (!stream.skip('}', true)) {
        stream.undo(1);
      }
    }
    state.next = string;
    return 'escaped';
  }
  function comment(stream, state) {
    state.next = !stream.skip('###', true) && comment;
    return 'comment';
  }
  function commentInRegexp(stream, state) {
    stream.next() == '#' ? stream.skip() : stream.undo(1);
    state.next = blockRegexp;
    return 'comment';
  }
  function regexp(stream, state, escaped) {
    var esc = !!escaped, ch;
    while (ch = stream.next()) {
      if (ch == '\\' && !stream.eol()) {
        stream.undo(1);
        state.next = escapedRegexp;
        return 'regexp';
      }
      if (ch == '/') {
        stream.take(/^[gimy]+/);
        state.next = null;
        return 'regexp';
      }
    }
    state.next = null;
    return 'regexp';
  }
  function blockRegexp(stream, state) {
    var ch, i = 0;
    while (ch = stream.next()) {
      if (ch == '\\' && !stream.eol()) {
        stream.undo(1);
        state.next = escapedRegexp;
        return 'regexp';
      }
      if (ch == '/') {
        ++i;
        if (i == 3) {
          stream.take(/^[gimy]+/);
          state.next = state.blockRegexp = null;
          return 'regexp';
        }
      } else {
        if (ch == '#' && stream.isBefore(' ')) {
          stream.undo(1);
          state.next = commentInRegexp;
          return 'regexp';
        }
        i = 0;
      }
    }
    state.next = blockRegexp;
    return 'regexp';
  }
  function escapedRegexp(stream, state) {
    if (stream.eat('\\')) {
      var ch = stream.next();
      if (ch) {
        state.next = state.blockRegexp ? blockRegexp : regexp;
        return 'escaped';
      }
      stream.undo(1);
    }
    return (state.blockRegexp ? blockRegexp : regexp)(stream, state, true);
  }
  function parameters(stream, state) {
    var ch = stream.next();
    if (ch) {
      if (ch == '=') return 'operator';
      if (ch == '(') return 'bracket';
      if (ch == ')') {
        state.next = null;
        return 'bracket';
      }
      if (ch == '.' && stream.eat('.') && stream.eat('.')) {
        return 'operator';
      }
      if (wordRgx.test(ch)) {
        var word = ch + stream.take(/^[\w$\xa1-\uffff]+/);
        if (stream.eol()) state.next = null;
        state.context.params[word] = true;
        return 'parameter';
      }
    }
    if (stream.eol()) state.next = null;
    return;
  }
  
  function pushcontext(stream, state, name) {
    state.context = { name: name, vars: {}, params: {}, indent: getContextLevel(state) + 1, prev: state.context };
    stream.markDefinition({
      name: name,
      params: state.context.params
    });
  }
  function popcontext(state) {
    if (state.context.prev) state.context = state.context.prev;
  }
  function isVariable(varname, state) {
    for (var ctx = state.context; ctx; ctx = ctx.prev) {
      if ('string' == typeof ctx.vars[varname]) return ctx.vars[varname];
      if (ctx.params[varname] === true) return 'parameter';
    }
  }
  function getContextLevel(state) {
    var i = 0;
    for (var ctx = state.context.prev; ctx; ctx = ctx.prev) ++i;
    return i;
  }
  
  return new CodePrinter.Mode({
    name: 'CoffeeScript',
    blockCommentStart: '###',
    blockCommentEnd: '###',
    lineComment: '#',
    indentTriggers: /[\}\]\)>]/,
    matching: 'brackets',
    
    initialState: function() {
      return {
        context: { vars: {}, params: {}, indent: 0 }
      }
    },
    iterator: function(stream, state) {
      if (stream.pos == 0) {
        while (state.context.prev && stream.indentation < state.context.indent) {
          state.context = state.context.prev;
        }
      }
      
      var ch = stream.next();
      if (ch == '#') {
        if (stream.eat('#') && stream.eat('#')) return comment(stream, state);
        stream.skip();
        return 'comment';
      }
      if (ch == '-') {
        if (stream.eat('>')) {
          return 'keyword';
        }
        if (stream.isAfter(/^\d/)) {
          stream.match(numericRgx, true);
          return 'numeric';
        }
      }
      if (ch == '"' || ch == "'" || ch == '`') {
        state.quote = ch;
        return string(stream, state);
      }
      if (ch == '/') {
        if (stream.isAfter('//')) {
          state.blockRegexp = true;
          return blockRegexp(stream, state);
        }
        if (stream.lastStyle == 'word' || stream.lastStyle == 'parameter' || stream.lastStyle == 'numeric'
          || stream.lastStyle == 'constant' || stream.lastValue == ')') {
          return 'operator';
        }
        return regexp(stream, state);
      }
      if (ch == '@') {
        return 'special';
      }
      if (/\d/.test(ch)) {
        if (ch == '0' && stream.eat('x')) {
          stream.take(/^[0-9a-f]+/);
          return 'numeric hex';
        }
        stream.match(numericRgx, true);
        return 'numeric';
      }
      if (wordRgx.test(ch)) {
        var word = ch + stream.take(/^[\w$\xa1-\uffff]+/);
        
        if (booleans.test(word)) return 'builtin boolean';
        if (constants.test(word)) return 'builtin';
        if (operators.test(word)) return 'operator';
        if (controls.indexOf(word) >= 0) return 'control';
        if (keywords.indexOf(word) >= 0) return 'keyword';
        if (specials.indexOf(word) >= 0) return 'special';
        
        if (stream.isAfter(/^\s*[=:]\s*(\([\w\s\,\.]*\))?\s*->/)) {
          if (RegExp.$1) state.next = parameters;
          state.context.vars[word] = 'function';
          pushcontext(stream, state, word);
          return 'function';
        }
        if (stream.isAfter(/^\s*\=(.*)$/)) {
          if (/^\s*$/.test(RegExp.$1)) pushcontext(stream, state, word);
          return state.context.vars[word] = 'variable';
        }
        if (stream.isAfter(/^\s*:/)) return 'property';
        if (stream.isAfter(/^\s+[\d\"\'\w]/)) return 'function';
        
        return isVariable(word, state);
      }
      if (/[\[\]{}\(\)]/.test(ch)) {
        return 'bracket';
      }
      if (operatorRgx.test(ch)) {
        stream.eatWhile(operatorRgx);
        return 'operator';
      }
    },
    indent: function(stream, state, oldIndent) {
      if (stream.sol() && oldIndent != null) return Math.min(stream.indentation, oldIndent);
      var i = getContextLevel(state);
      if (stream.lastValue == '->') return i - 1;
      return i;
    },
    snippets: {
      'log': {
        content: 'console.log ',
      },
      'dcl': {
        content: '$ -> '
      },
      'sif': {
        content: 'do () -> '
      },
      'timeout': {
        content: 'setTimeout -> , 100',
        cursorMove: -5
      },
      'interval': {
        content: 'setInterval -> , 100',
        cursorMove: -5
      }
    }
  });
});