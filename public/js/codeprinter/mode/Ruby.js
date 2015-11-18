/* CodePrinter - Ruby mode */

CodePrinter.defineMode('Ruby', function() {
  
  var operatorRgx = /[+\-\*\/%=!<>&|^~]/
  , controls = [
    'begin','case','def','do','else','elseif','end','for',
    'then','undef','until','while','if','unless'
  ]
  , specials = [
    'eval','fail','gets','lambda','print','proc','puts'
  ]
  , keywords = [
    'alias','and','break','class','defined?','ensure','in','loop','module',
    'next','nil','not','or','private','protected','public','redo','rescue',
    'retry','return','self','super','when','yield'
  ]
  
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
    if (!ch) state.next = string;
    else state.next = state.quote = null;
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
    if (stream.match(/=end/i, true)) {
      state.next = undefined;
      return 'comment';
    }
    stream.skip();
    state.next = comment;
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
        stream.eatWhile(/[ioxmuesn]/);
        state.next = null;
        return 'regexp';
      }
    }
    state.next = null;
    return 'regexp';
  }
  function escapedRegexp(stream, state) {
    if (stream.eat('\\')) {
      var ch = stream.next();
      if (ch) {
        state.next = regexp;
        return 'escaped';
      }
      stream.undo(1);
    }
    return regexp(stream, state, true);
  }
  
  function pushcontext(state) {
    state.context = { vars: {}, params: {}, indent: state.indent + 1, prev: state.context };
  }
  function popcontext(state) {
    if (state.context.prev) state.context = state.context.prev;
  }
  function isVariable(varname, state) {
    for (var ctx = state.context; ctx; ctx = ctx.prev)
      if (ctx.vars[varname] === true || ctx.params[varname] === true)
        return true;
  }
  
  return new CodePrinter.Mode({
    name: 'Ruby',
    blockCommentStart: '=begin',
    blockCommentEnd: '=end',
    lineComment: '#',
    matching: 'brackets',
    
    initialState: function() {
      return {
        indent: 0,
        context: { vars: {}, params: {}, indent: 0 }
      }
    },
    iterator: function(stream, state) {
      var ch = stream.next();
      
      if (ch == "'" || ch == '"') {
        state.quote = ch;
        return string(stream, state);
      }
      if (ch == '$' || ch == '@') {
        if (ch == '@') stream.eat('@');
        stream.eatWhile(/\w/);
        return 'variable';
      }
      if (ch == '#') {
        stream.skip();
        return 'comment';
      }
      if (ch == '0' && stream.eat(/x/i)) {
        stream.eatWhile(/[0-9a-f]/i);
        return 'numeric hex';
      }
      if (/[\[\]{}\(\)]/.test(ch)) {
        if (ch == ')' && state.def) state.def = undefined;
        return 'bracket';
      }
      if (ch == '=' && stream.match(/^begin/i, true)) {
        return comment(stream, state);
      }
      if (ch == '/' && (!stream.lastValue || stream.lastStyle == 'operator')) {
        return regexp(stream, state);
      }
      if (operatorRgx.test(ch)) {
        stream.eatWhile(operatorRgx);
        return 'operator';
      }
      if (/\d/.test(ch)) {
        stream.match(/^\d*(\.\d+)?/, true);
        return 'numeric';
      }
      if (/\w/.test(ch)) {
        var word = (ch + stream.eatWhile(/\w/)).toLowerCase();
        
        if (word == 'def') {
          if (!stream.eol()) state.def = true;
          pushcontext(state);
          ++state.indent;
          return 'control';
        }
        if (state.def) {
          if (state.def === true) {
            state.def = word;
            stream.markDefinition({
              name: word,
              params: state.context.params
            });
            return 'special';
          }
          if ('string' == typeof state.def) {
            state.context.params[word] = true;
            return 'parameter';
          }
        }
        
        if (word == 'true' || word == 'false') return 'builtin boolean';
        if (word == 'do' || word == 'elsif' || word == 'else' || (stream.pos == 2 && word == 'if') || (stream.pos == 6 && word == 'unless')) {
          ++state.indent;
          return 'control';
        }
        if (word == 'end') {
          if (state.indent == state.context.indent) {
            popcontext(state);
          }
          --state.indent;
          return 'control';
        }
        if (controls.indexOf(word) >= 0) return 'control';
        if (keywords.indexOf(word) >= 0) return 'keyword';
        if (specials.indexOf(word) >= 0) return 'special';
        
        if (isVariable(word, state)) return 'variable';
        if (stream.isAfter(/^\s*\(/)) return 'function';
        if (ch == ch.toUpperCase()) return 'constant';
      }
    },
    parse: function(stream) {
      var sb = stream.stateBefore, found;
      
      if (sb && sb.comment) {
        stream.eatWhile('=end').wrap('comment', 'block-comment');
        stream.isStillHungry() && stream.continueState();
      }
      
      while (found = stream.match(this.regexp)) {
        if (!isNaN(found)) {
          if (found.substr(0, 2).toLowerCase() == '0x') {
            stream.wrap('numeric', 'hex');
          } else {
            if ((found+'').indexOf('.') === -1) {
              stream.wrap('numeric', 'int');
            } else {
              stream.wrap('numeric', 'float');
            }
          }
        } else if (/^\w+/.test(found)) {
          if (/^(true|false)$/i.test(found)) {
            stream.wrap('builtin', 'boolean');
          } else if (this.controls.test(found)) {
            stream.wrap('control');
          } else if (this.keywords.test(found)) {
            stream.wrap('keyword');
          } else if (this.specials.test(found)) {
            stream.wrap('special');
          } else if (stream.isBefore('def') || stream.isAfter('(')) {
            stream.wrap('function');
          } else if (stream.isBefore('.') || stream.isBefore(':')) {
            stream.wrap('property');
          }
        } else if (found.length == 1) {
          if (this.punctuations[found]) {
            stream.wrap('punctuation', this.punctuations[found]);
          } else if (this.operators[found]) {
            stream.wrap('operator', this.operators[found]);
          } else if (this.brackets[found]) {
            stream.applyWrap(this.brackets[found]);
          } else if (found === '"' || found === "'") {
            stream.eat(found, this.expressions[found].ending, function() {
              this.tear().wrap('invalid');
            }).applyWrap(this.expressions[found].classes);
          } else if (found == '#') {
            stream.eatAll(found).wrap('comment', 'line-comment');
          }
        } else if (found[0] == '=') {
          stream.eatGreedily(found, '=end').wrap('comment', 'block-comment');
          stream.isStillHungry() && stream.setStateAfter('comment');
        } else if (found[0] == '/') {
          stream.wrap('regexp').eatEach(/\\./).wrapAll('escaped');
        }
      }
      return stream;
    },
    indentation: function(textBefore, textAfter, line, indent, parser) {
      var words = textBefore.match(/(\w+)/);
      if (words) {
        for (var i = 1; i < words.length; i++) {
          if (indentIncrements.indexOf(words[i].toLowerCase()) >= 0) {
            return 1;
          }
        }
      }
      return 0;
    }
  });
  
  var controls = [
    'begin','case','def','do','else','elseif','end','for',
    'if','then','undef','unless','until','while'
  ]
  , specials = [
    'eval','fail','gets','lambda','print','proc','puts'
  ]
  , keywords = [
    'alias','and','break','class','defined?','ensure','in','loop','module',
    'next','nil','not','or','private','protected','public','redo','rescue',
    'retry','return','self','super','when','yield'
  ]
  , indentIncrements = ['if','def','do','for','case']
  , keyMap = {}
  , tracking = {
    "end": function(key, textline, details) {
      if (this.isState('control', details.line, details.columnStart+1) && /^\W{0,2}$/.test(textline.charAt(details.columnStart-1) + textline.charAt(details.columnEnd))) {
        var s, tmpStr, counter = 1
        , line = details.line
        , col = details.columnStart
        , arr = indentIncrements.slice(0);
        arr.push('end');
        
        do {
          tmpStr = s = null;
          for (var i = 0; i < arr.length; i++) {
            var cs = this.searchLeft(arr[i], line, col, 'control');
            if (cs[0] >= 0 && cs[1] >= 0 && (!s || cs[0] > s[0] || cs[0] == s[0] && cs[1] > s[1])) {
              if ((arr[i] != 'if' && arr[i] != 'unless') || this.substring([cs[0], 0], [cs[0], cs[1]]).search(/^\s*$/) === 0) {
                s = cs;
                tmpStr = arr[i];
              }
            }
          }
          if (s && s[0] >= 0 && s[1] >= 0) {
            tmpStr != 'end' ? --counter : ++counter;
            line = s[0];
            col = s[1];
          } else {
            return false;
          }
        } while (counter != 0);
        
        if (tmpStr) {
          this.createHighlightOverlay(
            [s[0], s[1], tmpStr],
            [details.line, details.columnStart, key]
          );
        }
      }
    }
  }
  , fn = function(ctrl) {
    return function(key, textline, details) {
      if (this.isState('control', details.line, details.columnStart+1) && /^\W{0,2}$/.test(textline.charAt(details.columnStart-1) + textline.charAt(details.columnEnd))) {
        var s, counter = 1
        , line = details.line
        , col = details.columnEnd;
        if ((ctrl != 'if' && ctrl != 'unless') || this.substring([line, 0], [line, details.columnStart]).search(/^\s*$/) === 0) {
          do {
            var tmpStr = 'end';
            s = this.searchRight(tmpStr, line, col, 'control');
            
            if (s[0] >= 0 && s[1] >= 0) {
              for (var i = 0; i < indentIncrements.length; i++) {
                var cs = this.searchRight(indentIncrements[i], line, col, 'control');
                if (cs[0] >= 0 && cs[1] >= 0 && (cs[0] < s[0] || cs[0] == s[0] && cs[1] < s[1])) {
                  if ((indentIncrements[i] != 'if' && indentIncrements[i] != 'unless') || this.substring([cs[0], 0], [cs[0], cs[1]]).search(/^\s*$/) === 0) {
                    s = cs;
                    tmpStr = indentIncrements[i];
                  }
                }
              }
              tmpStr != 'end' ? ++counter : --counter;
              line = s[0];
              col = s[1] + tmpStr.length;
            } else {
              return false;
            }
          } while (counter != 0);
          
          this.createHighlightOverlay(
            [details.line, details.columnStart, ctrl],
            [s[0], s[1], 'end']
          );
        }
      }
    }
  }
  
  for (var i = 0; i < indentIncrements.length; i++) {
    tracking[indentIncrements[i]] = fn(indentIncrements[i]);
  }
  
  keyMap['D'] = keyMap['d'] = function(e) {
    if (this.options.autoIndent) {
      var bf = this.caret.textBefore();
      if (/^\s*en$/i.test(bf)) {
        var line = this.caret.line()
        , indent = this.getNextLineIndent(line-1);
        this.caret.setTextBefore(this.tabString(indent-1) + bf.trim());
      }
    }
  }
});