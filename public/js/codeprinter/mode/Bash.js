/* CodePrinter - Bash mode */

CodePrinter.defineMode('Bash', function() {
  
  var wordRgx = /\w/
  , closeBrackets = /^[}\]\)]/
  , operatorRgx = /[+\-*\/%!=<>&|~^]/
  , controlsA = ['case','do','then']
  , controlsB = ['for','in','select','until','while','done','fi','esac']
  , controlsC = ['if', 'else', 'elif']
  , keywords = ['break','continue','shift']
  , specials = ['$','echo','exit','print','printf','read'];
  
  function string(stream, state) {
    var ch;
    while (ch = stream.next()) if (ch == state.quote) break;
    if (ch) state.quote = state.next = null;
    else state.next = string;
    return 'string';
  }
  
  function pushcontext(state) {
    state.context = { vars: {}, indent: state.indent + 1, prev: state.context };
  }
  function popcontext(state) {
    if (state.context.prev) state.context = state.context.prev;
  }
  function isVariable(varname, state) {
    for (var ctx = state.context; ctx; ctx = ctx.prev) if ('string' == typeof ctx.vars[varname]) return ctx.vars[varname];
  }
  
  return new CodePrinter.Mode({
    name: 'Bash',
    indentTriggers: /[\)\]}eci]/,
    lineComment: '#',
    matching: 'brackets',
    
    initialState: function() {
      return {
        indent: 0,
        context: { vars: {}, indent: 0 }
      }
    },
    iterator: function(stream, state) {
      if (stream.pos == 0 && state.control) {
        state.control = undefined;
      }
      var ch = stream.next();
      if (ch == '"' || ch == "'" || ch == '`') {
        state.quote = ch;
        return string(stream, state);
      }
      if (ch == '#') {
        if (stream.pos == 1) {
          stream.skip();
          return 'comment';
        }
        return 'operator';
      }
      if (ch == '$') {
        var word = stream.match(/^\w+/, true);
        return word ? 'variable' : 'special';
      }
      if (ch == '0' && stream.eat('x')) {
        stream.eatWhile(/[0-9a-f]/i);
        return 'numeric hex';
      }
      if (/\d/.test(ch)) {
        stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/, true);
        return 'numeric';
      }
      if (wordRgx.test(ch)) {
        var word = ch + stream.eatWhile(wordRgx), b;
        
        if (word == 'function') {
          state.fn = true;
          return 'special';
        }
        if (state.fn === true) {
          state.fn = word;
          return state.context.vars[word] = 'function';
        }
        if (word == 'true' || word == 'false') return 'builtin boolean';
        if (controlsA.indexOf(word) >= 0 || (b = controlsB.indexOf(word)) >= 0) {
          if (b >= 5) --state.indent;
          if (b == null) ++state.indent;
          state.control = word;
          return 'control';
        }
        if (controlsC.indexOf(word) >= 0) return 'control';
        if (keywords.indexOf(word) >= 0) return 'keyword';
        if (specials.indexOf(word) >= 0) return 'special';
        
        if (stream.isAfter(/^(\s*)\=/)) {
          if (RegExp.$1) return 'invalid';
          return state.context.vars[word] = 'variable';
        }
        return isVariable(word, state) || 'word';
      }
      if (ch == '{') {
        if (state.fn) {
          pushcontext(state);
          state.context.name = state.fn;
          state.fn = undefined;
        }
        ++state.indent;
        return 'bracket';
      }
      if (ch == '}') {
        if (state.indent == state.context.indent) {
          popcontext(state);
        }
        --state.indent;
        return 'bracket';
      }
      if (/[\[\]\(\)]/.test(ch)) {
        return 'bracket';
      }
      if (ch == ';') {
        if (state.control) state.control = undefined;
        return 'punctuation';
      }
      if (ch == '-' && stream.match(/^[a-z\-]+/i, true)) {
        return 'parameter';
      }
      if (operatorRgx.test(ch)) {
        stream.eatWhile(operatorRgx);
        return 'operator';
      }
    },
    indent: function(stream, state) {
      var i = state.indent;
      if (stream.isAfter(closeBrackets)) {
        return stream.lastStyle == 'bracket' ? [i, -1] : i - 1;
      }
      if (stream.isAfter(/^(done|esac|fi|else|elif)\b/)) {
        return i - 1;
      }
      return i;
    },
    completions: function(stream, state) {
      var vars = [];
      for (var ctx = state.context; ctx; ctx = ctx.prev) {
        vars.push.apply(vars, Object.keys(ctx.vars));
      }
      return {
        values: vars,
        search: 200
      }
    }
  });
});