/* CodePrinter - YAML mode */

CodePrinter.defineMode('YAML', function() {
  
  var wordRgx = /[\w\-]/;
  
  function string(stream, state, escaped) {
    var esc = !!escaped, ch;
    while (ch = stream.next()) {
      if (ch == '"' && !esc) break;
      if (esc = !esc && ch == '\\') {
        stream.undo(1);
        state.next = escapedString;
        return 'string';
      }
    }
    if (!ch && esc) state.next = string;
    state.next = null;
    if (!ch) return 'invalid';
    return 'string';
  }
  function escapedString(stream, state) {
    if (stream.eat('\\')) {
      if (stream.match(allowedEscapes, true)) {
        state.next = string;
        return 'escaped';
      }
    }
    state.next = string;
    return 'invalid';
  }
  
  return new CodePrinter.Mode({
    name: 'YAML',
    lineComment: '#',
    autoCompleteWord: /[\&\*]?\w+/,
    autoCompleteTriggers: /[\*\&\w]/,
    
    initialState: function() {
      return {
        identifiers: {},
        indent: 0
      }
    },
    iterator: function(stream, state) {
      if (stream.pos == 0) {
        if (state.folded && stream.indentation < state.indent) {
          state.folded = false;
        }
        state.indent = stream.indentation;
        state.value = undefined;
      }
      var ch = stream.next();
      if (ch == '"') {
        return string(stream, state);
      }
      if (ch == '#') {
        stream.skip();
        return 'comment';
      }
      if (ch == '-' || ch == '.') {
        if (stream.eat(ch) && stream.eat(ch)) {
          return 'comment';
        }
        return 'operator';
      }
      if (ch == ':') {
        ++state.indent;
        return 'special';
      }
      if (ch == '|' || ch == '>') {
        state.folded = true;
        return 'operator';
      }
      if (ch == '>') {
        return 'operator';
      }
      if (ch == '&' || ch == '*') {
        var id = stream.eatWhile(/\w/);
        if (id) state.identifiers[id] = true;
        return 'parameter';
      }
      if (/[\[\]{}\(\)]/.test(ch)) {
        return 'bracket';
      }
      if (/\d/.test(ch)) {
        stream.eatUntil(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
        return 'numeric';
      }
      if (wordRgx.test(ch)) {
        var word = ch + stream.eatWhile(wordRgx);
        if (state.value || state.folded) {
          return 'string';
        }
        if (stream.isAfter(':')) {
          state.value = true;
          return 'keyword';
        }
      }
    },
    indent: function(stream, state) {
      return stream.pos == 0 ? stream.indentation : state.indent;
    },
    completions: function(stream, state) {
      if (stream.lastStyle == 'parameter') {
        return Object.keys(state.identifiers);
      }
      return false;
    }
  });
});