/* CodePrinter - HTML mode */

CodePrinter.defineMode('HTML', ['JavaScript', 'CSS'], function(JavaScript, CSS) {
  
  var wordRgx = /[\w\-]/i
  , selfClosingTagsRgx = /^(area|base|br|c(ol|ommand)|embed|hr|i(mg|nput)|keygen|link|meta|param|source|track|wbr)$/i
  , matchTagNameRgx = /<\s*(\w+)\s*[^>]*>?$/;
  
  function comment(stream, state) {
    if (stream.eatUntil(/\-\-\>/)) {
      state.next = undefined;
    } else {
      stream.skip();
      state.next = comment;
    }
    return 'comment';
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
  function cdata(stream, state) {
    while (ch = stream.next()) {
      if (ch == ']' && stream.match(/^\]>/, true)) {
        state.next = undefined;
        return 'comment cdata';
      }
    }
    state.next = cdata;
    return 'comment cdata';
  }
  
  function pushcontext(state, name) {
    state.context = { name: name, indent: state.indent, prev: state.context }
  }
  function popcontext(state) {
    if (state.context.prev) state.context = state.context.prev;
  }
  
  return new CodePrinter.Mode({
    name: 'HTML',
    blockCommentStart: '<!--',
    blockCommentEnd: '-->',
    indentTriggers: /\//,
    autoCompleteTriggers: /</,
    
    initialState: function() {
      return {
        indent: 0,
        context: { name: null, indent: 0 }
      }
    },
    iterator: function(stream, state) {
      if (stream.pos == 0) state.tagName = state.bracketopen = state.closingTag = undefined;
      var ch = stream.next();
      if (state.bracketopen) {
        if (ch == '>') {
          if (!state.tagName) {
            state.bracketopen = undefined;
            return 'invalid';
          }
          if (state.closingTag) {
            --state.indent;
            if (state.tagName == state.context.name) popcontext(state);
          } else if (!stream.isAfter(/^\s*</)) {
            if (state.tagName == 'style') {
              state.parser = CSS;
              var i = state.indent;
              state.extend(CSS.initialState());
              state.indent = i;
            } else if (state.tagName == 'script') {
              state.parser = JavaScript;
              var i = state.indent;
              state.extend(JavaScript.initialState());
              state.indent = i;
            }
          }
          state.bracketopen = state.tagName = state.closingTag = undefined;
          return 'bracket';
        }
        if (ch == '"' || ch == "'") {
          state.quote = ch;
          return string(stream, state);
        }
        if (ch == '=') {
          return 'operator';
        }
        if (/[a-z]/i.test(ch)) {
          var word = ch + stream.eatWhile(wordRgx);
          if (state.tagName) {
            return 'property';
          }
          state.tagName = word;
          if (!state.closingTag) {
            ++state.indent;
            if (selfClosingTagsRgx.test(word)) {
              state.closingTag = true;
            }
          }
          if (!state.closingTag) {
            pushcontext(state, word);
          }
          return 'keyword';
        }
      }
      if (ch == '&') {
        if (stream.match(/^[^;]+;/, true)) {
          return 'escaped';
        }
        return 'invalid';
      }
      if (ch == '<') {
        if (stream.eat('!')) {
          if (stream.match(/^\-\-/, true)) {
            return comment(stream, state);
          }
          if (stream.match(/^\[CDATA\[/, true)) {
            return cdata(stream, state);
          }
          if (stream.eatUntil(/>/)) {
            return 'special doctype';
          }
        }
        if (stream.eatUntil(/^\s*\//)) state.closingTag = true;
        state.bracketopen = true;
        return 'bracket';
      }
    },
    indent: function(stream, state) {
      if (stream.lastValue == '>' && stream.isAfter('<')) {
        return [state.indent, -1];
      }
      if (stream.isAfter(/^\s*<\//) || stream.peek() == '/' && stream.lastValue == '</') {
        return state.indent - 1;
      }
      return state.indent;
    },
    onCompletionChosen: function(choice) {
      if (/<\/[\w\-]*$/.test(this.caret.textBefore())) {
        this.insertText('>');
      }
    },
    keyMap: {
      '/': function(stream, state) {
        if (this.options.insertClosingBrackets) {
          if (stream.isBefore('<') && state.context.name) {
            this.insertText('/'+state.context.name+'>');
            return false;
          }
        }
      }
    },
    snippets: {
      '<': function(stream, state) {
        if (state.context) {
          return '</'+state.context.name+'>';
        }
      }
    }
  });
});