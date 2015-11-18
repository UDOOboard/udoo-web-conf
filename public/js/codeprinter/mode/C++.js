/* CodePrinter - Cpp Mode */

CodePrinter.defineMode('C++', function() {
  var wordRgx = /[\w$\xa1-\uffff]/
  , operatorRgx = /[+\-*&%=<>!?|~^]/
  , closeBrackets = /^[}\]\)]/
  , allowedEscapes = /('|"|\?|\\|a|b|f|n|r|t|v|\d{3}|x\d{2}|u\d{4}|U\d{8})/
  , controls = ['if','else','elseif','for','switch','while','do','try','catch']
  , types = [
    'void','int','double','short','long','char','float','bool','unsigned',
    'signed','enum','struct','class','char16_t','char32_t','wchar_t'
  ]
  , keywords = [
    'return','this','new','break','continue','case','sizeof','const','using',
    'namespace','alignas','alignof','and','and_eq','asm','auto','bitand','bitor',
    'compli','constexpr','const_cast','decltype','default','delete','dynamic_cast',
    'explicit','export','extern','friend','goto','inline','mutable','noexcept','not',
    'not_eq','nullptr','operator','or','or_eq','private','protected','public','register',
    'reinterpret_cast','static','static_assert','static_cast','template','thread_local',
    'throw','typedef','typeid','typename','union','virtual','volatile','xor','xor_eq'
  ]
  , includeMap = {
    'iostream': ['cin','cout','cerr','clog','wcin','wcout','wcerr','wclog'],
    'istream': ['istream','iostream','wistream','wiostream','basic_istream','basic_iostream','endl'],
    'ostream': ['ostream','wostream','basic_ostream','endl'],
    'cstdio': {
      constants: ['BUFSIZ','EOF','FILENAME_MAX','FOPEN_MAX','L_tmpnam','NULL','TMP_MAX'],
      types: ['FILE','fpos_t','size_t']
    },
    'cstdlib': {
      constants: ['EXIT_FAILURE','EXIT_SUCCESS','MB_CUR_MAX','NULL','RAND_MAX'],
      types: ['div_t','ldiv_t','lldiv_t','size_t']
    },
    'cstring': {
      specials: ['string'],
      constants: ['NULL'],
      types: ['size_t']
    },
    'array': ['array'],
    'deque': ['deque'],
    'forward_list': ['forward_list'],
    'list': ['list'],
    'map': ['map','multimap'],
    'queue': ['queue','priority_queue'],
    'set': ['set','multiset'],
    'stack': ['stack'],
    'unordered_map': ['unordered_map','unordered_multimap'],
    'unordered_set': ['unordered_set','unordered_multiset'],
    'vector': ['vector']
  }
  
  function union(that, a) {
    a.forEach(function(i) { if (that.indexOf(i) < 0) that.push(i); });
    return that;
  }
  union(union(includeMap.iostream, includeMap.istream), includeMap.ostream);
  
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
    else state.next = null;
    if (!ch) return 'invalid';
    state.quote = null;
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
  function include(stream, state) {
    var af = stream.rest(), inc
    , m = af.match(/[\w\/\.]+/);
    
    if (m && (inc = includeMap[m[0]])) {
      if (inc instanceof Array) {
        writeGlobal(state, inc, 'special');
      } else {
        inc.constants && writeGlobal(state, inc.constants, 'constant');
        inc.specials && writeGlobal(state, inc.specials, 'special');
        inc.types && writeGlobal(state, inc.types, 'keyword type');
      }
    }
    stream.skip();
    state.next = undefined;
    return 'string';
  }
  function parameters(stream, state) {
    var p = 0, ch;
    while (ch = stream.next()) {
      if (ch == '(') {
        ++p;
        return 'bracket';
      }
      if (ch == ')') {
        --p;
        if (p == 0) state.next = null;
        return 'bracket'; 
      }
      if (ch == '{' || ch == ';') {
        stream.undo(1);
        state.next = null;
        return;
      }
      if (ch == ',') return 'punctuation';
      if (ch == '*' || ch == '&') return 'operator';
      if (wordRgx.test(ch)) {
        var word = ch + stream.eatWhile(wordRgx);
        if (types.indexOf(word) >= 0) return 'keyword type';
        state.context.params[word] = true;
        return 'parameter';
      }
    }
    return;
  }
  
  function pushcontext(state) {
    state.context = { vars: {}, params: {}, indent: state.indent + 1, prev: state.context };
  }
  function popcontext(state) {
    if (state.context.prev) state.context = state.context.prev;
  }
  function writeGlobal(state, arr, kind) {
    for (var i = 0; i < arr.length; i++) {
      state.globals[arr[i]] = kind;
    }
  }
  function isVariable(varname, state) {
    for (var ctx = state.context; ctx; ctx = ctx.prev) {
      if (ctx.vars[varname] === true || ctx.params[varname] === true) return 'variable';
    }
  }
  
  function Definition(state) {
    this.type = state.type;
    this.name = state.fn;
    this.params = state.context.params;
  }
  Definition.prototype = {
    toString: function() {
      var pstr = '';
      for (var k in this.params) pstr += k + ', ';
      return (this.type ? this.type + ' ' : '') + this.name + '(' + pstr.slice(0, -2) + ')';
    }
  }
  
  return new CodePrinter.Mode({
    name: 'C++',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    lineComment: '//',
    matching: 'brackets',
    
    initialState: function() {
      return {
        indent: 0,
        globals: {},
        context: { vars: {}, params: {}, indent: 0 }
      }
    },
    iterator: function(stream, state) {
      var ch = stream.next();
      if (ch == '"' || ch == "'") {
        state.quote = ch;
        return string(stream, state);
      }
      if (ch == '/') {
        if (stream.eat('/')) {
          stream.skip();
          return 'comment';
        }
        if (stream.eat('*')) {
          return comment(stream, state);
        }
        if (stream.lastStyle == 'word' || stream.lastStyle == 'parameter' || stream.lastStyle == 'numeric'
          || stream.lastStyle == 'constant' || stream.lastValue == ')') {
          return 'operator';
        }
      }
      if (ch == '#' && stream.pos == 1) {
        var word = stream.eatWhile(/\w/);
        if (word == 'include' && !stream.eol()) {
          state.next = include;
        }
        return 'directive';
      }
      if (ch == '0' && stream.eat(/x/i)) {
        stream.eatWhile(/[\da-f]/i);
        return 'numeric hex';
      }
      if (/\d/.test(ch)) {
        stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/, true);
        return 'numeric';
      }
      if (/[\[\]{}\(\)]/.test(ch)) {
        if (ch == '{') {
          if (state.fn && state.type) {
            pushcontext(state);
            if ('string' == typeof state.fn) stream.markDefinition(new Definition(state));
            state.type = state.fn = null;
          }
          ++state.indent;
        } else if (ch == '}') {
          if (state.indent == state.context.indent) {
            popcontext(state);
          }
          --state.indent;
        }
        return 'bracket';
      }
      if (operatorRgx.test(ch)) {
        stream.eatWhile(operatorRgx);
        return 'operator';
      }
      if (wordRgx.test(ch)) {
        var word = ch + stream.eatWhile(wordRgx);
        
        if (stream.lastValue == 'namespace' || stream.isAfter('::')) return 'namespace';
        if (word == 'true' || word == 'false') return 'builtin boolean';
        if (controls.indexOf(word) >= 0) return 'control';
        if (types.indexOf(word) >= 0) {
          state.type = word;
          return 'keyword type';
        }
        if (keywords.indexOf(word) >= 0) return 'keyword';
        if ('string' == typeof state.globals[word]) return state.globals[word];
        
        if (stream.isAfter(/^\s*\(/)) {
          if (state.indent == state.context.indent && state.type && !state.vardef) {
            state.fn = word;
            state.next = parameters;
          }
          return 'function';
        }
        if (state.type) {
          state.context.vars[word] = state.vardef = true;
          return 'variable';
        }
        return isVariable(word, state);
      }
      if (ch == ';') {
        if (state.vardef) state.vardef = null;
        if (state.type) state.type = null;
        if (state.fn) state.fn = null;
      }
    },
    indent: function(stream, state) {
      if (stream.isAfter(closeBrackets)) {
        if (stream.lastStyle == 'bracket') return [state.indent, -1];
        return state.indent - 1;
      }
      return state.indent;
    },
    completions: function(stream, state) {
      var vars = [];
      if (state.context) {
        for (var ctx = state.context; ctx; ctx = ctx.prev) {
          vars.push.apply(vars, Object.keys(ctx.vars));
          vars.push.apply(vars, Object.keys(ctx.params));
        }
      }
      return {
        values: vars,
        search: 200
      }
    },
    snippets: {
      'out': 'cout << ',
      'in': 'cin >> ',
      'main': {
        content: 'int main(int argc, const char * argv[]) {}',
        cursorMove: -1
      }
    }
  });
});