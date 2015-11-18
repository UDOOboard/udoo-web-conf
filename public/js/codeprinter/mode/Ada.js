/* CodePrinter - Ada mode */

CodePrinter.defineMode('Ada', function() {
  
  var numericRgx = /^([\d_]+|[\d_]*\.[\d_]+|\d?\#\d+\#)(?:e[+\-]?[\d_]+)?/i
  , operatorRgx = /[+\-*\/%!=<>&|~^]/
  , specials = ['ada','gnat','interfaces','standard','system']
  , types = ['access','array','decimal','digits','integer','mod','protected','real','record']
  , controls = ['begin','case','do','end','else','elsif','for','goto','if','loop','procedure','task','when','while']
  , keywords = [
    'abort','abs','abstract','accept','aliased','all','and','at','body',
    'constant','declare','delay','delta','digits','end','entry',
    'exception','exit','function','generic','in','interface','is',
    'limited','new','not','of','or','others','out','overriding','package',
    'pragma','private','raise','range','rem','renames','requeue','return',
    'reverse','select','separate','some','subtype','synchronized','tagged',
    'terminate','then','type','until','use','with','xor'
  ]
  
  function string(stream, state) {
    state.next = stream.skip('"', true) ? null : string;
    return 'string';
  }
  function property(stream, state) {
    if (stream.take(/^\w+/)) {
      return 'property';
    }
    state.next = null;
    return;
  }
  
  function pushcontext(state, name) {
    state.context = { name: name, tasks: {}, vars: {}, indent: state.indent + 1, prev: state.context };
  }
  function popcontext(state) {
    if (state.context.prev) state.context = state.context.prev;
  }
  function isVariable(varName, state) {
    for (var ctx = state.context; ctx; ctx = ctx.prev) {
      if ('string' == typeof ctx.tasks[varName]) return 'special';
      if ('string' == typeof ctx.vars[varName]) return 'variable';
    }
  }
  
  return new CodePrinter.Mode({
    name: 'Ada',
    indentTriggers: /[dn]/i,
    lineComment: '--',
    matching: 'brackets',
    
    initialState: function() {
      return {
        indent: 0,
        context: { name: '', tasks: {}, vars: {}, indent: 0 }
      }
    },
    iterator: function(stream, state) {
      var ch = stream.next();
      if (ch == '-') {
        if (stream.eat('-')) {
          stream.skip();
          return 'comment';
        }
        return 'operator';
      }
      if (ch == "'") {
        if (stream.match(/^.'/, true)) {
          return 'string';
        }
        state.next = property;
        return;
      }
      if (ch == '"') {
        return string(stream, state);
      }
      if (ch == ';') {
        if (state.endPhase) state.endPhase = null;
        return;
      }
      if (/[\[\]{}\(\)]/.test(ch)) {
        return 'bracket';
      }
      if (operatorRgx.test(ch)) {
        stream.eatWhile(operatorRgx);
        return 'operator';
      }
      if (/[a-z]/i.test(ch)) {
        var word = ch + stream.take(/^\w*/)
        , lc = word.toLowerCase();
        
        if (lc == 'true' || lc == 'false') return 'builtin boolean';
        if (lc == 'null') return 'builtin';
        if (lc == 'procedure') {
          state.procedure = true;
          return 'control';
        }
        if (lc == 'task') {
          state.task = true;
          return 'control';
        }
        if (lc == 'end') {
          var m = stream.match(/^\s+(\w+)\b/);
          if (m && m[1] && state.context.name.toLowerCase() == m[1].toLowerCase()) {
            popcontext(state);
            --state.indent;
            state.endPhase = true;
          }
          return 'control';
        }
        if (state.procedure === true) {
          pushcontext(state, word);
          ++state.indent;
          state.procedure = null;
        }
        if (state.task == true && (lc == 'type' || lc == 'body')) {
          state.task = 2;
          return 'keyword';
        }
        if (controls.indexOf(lc) >= 0) {
          if (!state.endPhase && /(if|loop|select)/.test(lc)) {
            pushcontext(state, lc);
            ++state.indent;
          }
          return 'control';
        }
        if (keywords.indexOf(lc) >= 0) return 'keyword';
        if (types.indexOf(lc) >= 0) return 'keyword type';
        if (specials.indexOf(lc) >= 0) return 'special';
        if (stream.isAfter(/^\s*\(/)) return 'function';
        if (state.task == 2) {
          state.task = null;
          state.context.tasks[lc] = word;
          pushcontext(state, word);
          ++state.indent;
          return 'special';
        }
        if (stream.isAfter(/^\s*:/)) {
          state.context.vars[lc] = word;
          return 'variable';
        }
        return isVariable(lc, state);
      }
      if (/\d/.test(ch)) {
        stream.take(numericRgx);
        var f = RegExp.$1;
        return f && f[f.length-1] == '#' ? 'numeric hex' : 'numeric';
      }
    },
    indent: function(stream, state) {
      var i = state.indent;
      if (stream.isAfter(/^(begin|end)\b/i)) {
        return i - 1;
      }
      return i;
    }
  });
});