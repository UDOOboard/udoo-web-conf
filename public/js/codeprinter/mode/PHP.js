/* CodePrinter - PHP Mode */

CodePrinter.defineMode('PHP', function() {
  
  var wordFirstLetterRgx = /[a-z_\x7f-\xff]/i
  , wordRgx = /[\w\x7f-\xff]/i
  , varnameRgx = /^[a-z_\x7f-\xff][\w\x7f-\xff]*/i
  , openBrackets = /^[{\[(]/, closeBrackets = /^[}\])]/
  , operatorsRgx = /[=!+\-\*\/%<>|&\.]/
  , constants = ['__CLASS__','__DIR__','__FILE__','__FUNCTION__','__LINE__','__METHOD__','__NAMESPACE__','__TRAIT__']
  , controls = [
    'if','else','for','foreach','switch','case','default',
    'while','do','elseif','try','catch','finally','declare',
    'endif','endfor','endforeach','endswitch','endwhile','enddeclare'
  ]
  , keywords = [
    'abstract','and','array','as','break','class','clone','const','continue',
    'declare','default','extends','final','function','global','goto',
    'implements','interface','instanceof','namespace','new','or',
    'parent','private','protected','public','return','self','static',
    'throw','use','var','xor'
  ]
  , specials = [
    'define','defined','die','echo','empty','exit','eval','include','include_once',
    'isset','list','require','require_once','print','unset'
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
    var star, ch;
    while (ch = stream.next()) {
      if (star && ch == '/') {
        break;
      }
      star = ch == '*';
    }
    state.next = ch && star ? null : comment;
    return 'comment';
  }
  function namespace(stream, state) {
    stream.eatWhile(/[^\;]/);
    state.next = undefined;
    return 'namespace';
  }
  
  function pushcontext(state) {
    state.context = { vars: {}, classes: {}, methods: {}, indent: state.indent + 1, prev: state.context };
  }
  function popcontext(state) {
    if (state.context.prev) {
      state.context = state.context.prev;
    }
  }
  function isInContext(varname, state, prop) {
    for (var ctx = state.context; ctx; ctx = ctx.prev) if (ctx[prop][varname] === true) return ctx[prop][varname];
  }
  
  return new CodePrinter.Mode({
    name: 'PHP',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    lineComment: '//',
    indentTriggers: /[})\]efhr]/,
    matching: 'brackets',
    
    initialState: function() {
      return {
        indent: 0,
        context: { vars: {}, classes: {}, methods: {} }
      }
    },
    iterator: function(stream, state) {
      if (stream.pos == 0) state.namespace = state.classdef = undefined;
      var ch = stream.next();
      if (ch == '$') {
        var varname = stream.match(varnameRgx, true);
        if (varname) {
          if (varname == 'this') return 'special';
          state.context.vars[varname] = true;
          return 'variable';
        }
        return 'special';
      }
      if (ch == '"') {
        state.quote = ch;
        return string(stream, state);
      }
      if (ch == '/' && stream.eat('*')) {
        return comment(stream, state);
      }
      if (ch == '<' && stream.eat('?')) {
        stream.skip('php', true);
        ++state.indent;
        return 'external';
      }
      if (ch == '?' && stream.eat('>')) {
        --state.indent;
        return 'external';
      }
      if (ch == '_' && stream.eat('_') && stream.match(/^[A-Z]+__/, true)) {
        var constname = stream.from(stream.start);
        if (constants.indexOf(constname)) return 'builtin constant';
        return;
      }
      if (ch == '0' && stream.eat('x')) {
        stream.eatWhile(/[\da-f]/i);
        return 'numeric hex';
      }
      if (/\d/.test(ch)) {
        stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/, true);
        return 'numeric';
      }
      if (openBrackets.test(ch)) {
        if (ch == '{' && state.classdef) {
          pushcontext(state);
          state.classdef = undefined;
        }
        ++state.indent;
        return 'bracket';
      }
      if (closeBrackets.test(ch)) {
        if (ch == '}' && state.indent == state.context.indent) {
          popcontext(state);
        }
        --state.indent;
        return 'bracket';
      }
      if (operatorsRgx.test(ch)) {
        stream.eatWhile(operatorsRgx);
        return 'operator';
      }
      if (wordFirstLetterRgx.test(ch)) {
        var word = ch + stream.eatWhile(wordRgx);
        
        if (state.funcdef) {
          state.context.methods[word] = true;
          state.funcdef = undefined;
          return 'function';
        }
        if (state.classdef) {
          state.context.classes[word] = true;
          return 'special';
        }
        if (word == 'function') {
          state.funcdef = true;
          return 'keyword';
        }
        if (word == 'class') {
          state.classdef = true;
          return 'keyword';
        }
        if (word == 'namespace') {
          state.next = namespace;
          state.namespace = true;
          return 'keyword';
        }
        if (word == 'true' || word == 'false') return 'builtin boolean';
        if (word == 'null') return 'builtin';
        if (controls.indexOf(word) >= 0) return 'control';
        if (specials.indexOf(word) >= 0) return 'special';
        if (keywords.indexOf(word) >= 0) return 'keyword';
        if (stream.skip('::', true)) return 'namespace';
        
        if (isInContext(word, state, 'methods')) {
          return 'function';
        }
        if (isInContext(word, state, 'classes')) {
          return 'special';
        }
      }
    },
    indent: function(stream, state) {
      var i = state.indent;
      if (stream.lastStyle == 'bracket') {
        if (stream.isAfter(closeBrackets)) return [i, -1];
      }
      if (stream.isAfter(closeBrackets) || state.parser && stream.isAfter(/^\?>/i)) return i - 1;
      return i;
    },
    completions: function(stream, state) {
      var cc = [], fch = stream.lastValue && stream.lastValue[0];
      if (!fch || fch == '$') {
        for (var ctx = state.context; ctx; ctx = ctx.prev) {
          cc.push.apply(cc, Object.keys(ctx.vars));
        }
      }
      if (fch == '_') {
        cc.push.apply(cc, constants);
      }
      if (fch !== '$') {
        for (var ctx = state.context; ctx; ctx = ctx.prev) {
          cc.push.apply(cc, Object.keys(ctx.methods));
          cc.push.apply(cc, Object.keys(ctx.classes));
        }
      }
      return {
        values: cc,
        search: 100
      }
    }
  });
  
  var keyMap = {}
  
  keyMap['e'] = keyMap['f'] = keyMap['h'] = keyMap['r'] = function(e, k, ch) {
    var bf = this.caret.textBefore(), w = bf.split(/\s+/g).last()+ch;
    if (w == 'else' || this.parser.indentDecrements.indexOf(w) >= 0) {
      var line = this.caret.line()
      , indent = this.getNextLineIndent(line-1);
      this.getIndentAtLine(line-1) == indent && this.caret.setTextBefore(this.tabString(indent-1) + bf.trim());
    }
  }
  
  return new CodePrinter.Mode({
    name: 'PHP',
  	controls: new RegExp('^('+ controls.join('|') +')$', 'i'),
  	keywords: new RegExp('^('+ keywords.join('|') +')$', 'i'),
    specials: new RegExp('^('+ specials.join('|') +')$', 'i'),
    constants: new RegExp('^('+ constants.join('|') +')$', 'i'),
  	regexp: /\$[\w\d\_]+|\b\d*\.?\d+\b|\b0x[\da-fA-F]+\b|\b\w+\b|\/\*|\/\/|\?>|<\?php|<\?=?|[^\w\s]/,
    indentIncrements: ['else', ':', '[', '{'],
    indentDecrements: ['endif', 'endfor', 'endforeach', 'endswitch', 'endwhile', 'enddeclare', ']', '}'],
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    lineComment: '//',
    
    memoryAlloc: function() {
      return {
        constants: [],
        variables: [],
        classes: []
      }
    },
  	parse: function(stream, memory) {
  		var sb = stream.stateBefore, found;
      
      if (sb) {
        var e = this.expressions[sb.comment ? '/*' : sb.string];
        if (e) {
          stream.eatWhile(e.ending).applyWrap(e.classes);
          stream.isStillHungry() && stream.continueState();
        }
      }
      
  		while (found = stream.match(this.regexp)) {
        if (found[0] === '$') {
          if (found == '$this') {
            stream.wrap('special');
          } else {
            stream.wrap('variable');
            memory.variables.put(found.substr(1));
          }
        } else if (!isNaN(found)) {
          if (found.substr(0, 2).toLowerCase() == '0x') {
            stream.wrap('numeric', 'hex');
          } else {
            if ((found+'').indexOf('.') === -1) {
              stream.wrap('numeric', 'int');
            } else {
              stream.wrap('numeric', 'float');
            }
          }
        } else if (/^\w+$/i.test(found)) {
          if (found == 'define') {
            var m = stream.after().match(/^\s*\(('(\w+)'|"(\w+)")/);
            m && m[2] && memory.constants.put(m[2]);
            stream.wrap('special');
          } else if (/^(true|false)$/i.test(found)) {
        		stream.wrap('builtin', 'boolean');
        	} else if (this.constants.test(found)) {
            stream.wrap('builtin');
          } else if (this.controls.test(found)) {
        		stream.wrap('control');
  	      } else if (this.specials.test(found)) {
            stream.wrap('special');
          } else if (this.keywords.test(found)) {
  	      	stream.wrap('keyword');
  	      } else if (stream.isAfter('(')) {
        		stream.wrap('function');
        	} else if (stream.isBefore(/\bclass\b/)) {
            stream.wrap('special');
            memory.classes.put(found);
          } else if (stream.isBefore('const') || memory.constants.indexOf(found) >= 0) {
            stream.wrap('constant');
            memory.constants.put(found);
          } else if (stream.isAfter('::') || stream.isBefore(/\bnamespace\b/)) {
            stream.wrap('namespace');
          }
        } else if (found.length == 1) {
          if (found == '"' || found == "'") {
            stream.eatGreedily(found, this.expressions[found].ending).applyWrap(this.expressions[found].classes);
            stream.isStillHungry() && stream.setStateAfter({ string: found });
          } else if (this.operators[found]) {
            stream.wrap('operator', this.operators[found]);
          } else if (this.punctuations[found]) {
            stream.wrap('punctuation', this.punctuations[found]);
          } else if (this.brackets[found]) {
            stream.applyWrap(this.brackets[found]);
          }
        } else if (/^(<\?(php|=?)|\?>)$/.test(found)) {
          stream.wrap('external');
        } else if (this.expressions[found]) {
          var e = this.expressions[found];
          if (found === '//') {
            stream.eatAll(found).applyWrap(e.classes);
          } else if (found === '/*') {
            stream.eatGreedily(found, e.ending).applyWrap(e.classes);
            stream.isStillHungry() && stream.setStateAfter('comment');
          }
        }
  		}
  		return stream;
  	},
    indentation: function(textBefore, textAfter, line, indent, parser) {
      var before = (textBefore.match(/(\w+|.)$/) || [])[0]
      , after = (textAfter.match(/^(\w+|.)/) || [])[0];
      if (before) {
        if (parser.indentIncrements.indexOf(before) >= 0) {
          if (after && parser.indentDecrements.indexOf(after) >= 0) {
            return [1, 0];
          }
          return 1;
        }
        if (parser.indentDecrements.indexOf(before) >= 0) {
          return 0;
        }
      }
      var firstwordbefore = (textBefore.match(/^\w+/) || [])[0];
      if (firstwordbefore && parser.controls.test(firstwordbefore)) {
        return 1;
      }
      var i = 0, prevline = this.getTextAtLine(line - 1).trim();
      while (prevline && !/[\{\:]$/.test(prevline) && (word = (prevline.match(/^\w+/) || [])[0]) && parser.controls.test(word)) {
        i++;
        prevline = this.getTextAtLine(line - i - 1).trim();
      }
      return -i;
    },
    codeCompletions: function(bf, af) {
      if (/\_\w*$/.test(bf)) {
        return [].concat(constants, this.memory.constants);
      }
      if (/\$\w*$/.test(bf)) {
        return ['this'].concat(this.memory.variables);
      }
    },
    keyMap: keyMap,
    extension: {
      expressions: {
        "'": { ending: "'", classes: ['string', 'single-quote'] }
      }
    }
  });
});