/* CodePrinter - JSON Mode */

CodePrinter.defineMode('JSON', function() {
  
  var invalidCharacters = /['()\/\?!\-+=]/
  , allowedEscapes = /^(["\\\/bfnrt]|u[0-9a-fA-F]{4})/
  
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
    blockCommentStart: null,
    blockCommentEnd: null,
    lineComment: null,
    
    initialState: function() {
      return {
        indent: 0
      }
    },
    iterator: function(stream, state) {
      var ch = stream.next();
      
      if (ch == '"') {
        return string(stream, state);
      }
      if (ch == '0' && stream.eat('x')) {
        stream.eatWhile(/[0-9a-f]/i);
        return 'numeric hex';
      }
      if (ch == '{' || ch == '[') {
        ++state.indent;
        return 'bracket';
      }
      if (ch == '}' || ch == ']') {
        --state.indent;
        return 'bracket';
      }
      if (/\d/.test(ch)) {
        stream.eatUntil(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
        return 'numeric';
      }
      if (/\w/.test(ch)) {
        var word = ch + stream.eatWhile(/\w/);
        if (word == 'true' || word == 'false') {
          return 'builtin boolean';
        }
        if (word == 'null') {
          return 'builtin';
        }
        return 'invalid';
      }
      if (invalidCharacters.test(ch)) {
        stream.eatWhile(invalidCharacters);
        return 'invalid';
      }
    },
    indent: function(stream, state) {
      var caf = stream.isAfter(/^\s*[}\]]/);
      if (stream.lastStyle == 'bracket' && /[\(\[\{]/.test(stream.lastValue) && caf) return [state.indent, -1];
      if (caf) return state.indent - 1;
      return state.indent;
    },
    completions: function(stream, state) {
      return ['true', 'false', 'null'];
    }
  });
});