/* CodePrinter - Java Mode */

CodePrinter.defineMode('Java', function() {
  
  var wordRgx = /[\w\$_\xa1-\uffff]/
  , operatorRgx = /[+\-*&%=<>!?|\/]/
  , openBrackets = /^[{\[\(]/, closeBrackets = /^[}\]\)]/
  , controls = ['if','else','while','for','do','case','switch','try','catch','finally']
  , types = ['byte','short','int','long','float','double','boolean','char']
  , constants = ['null','undefined','NaN','Infinity']
  , keywords = [
    'abstract','assert','break','const','continue','default','enum','extends',
    'final','goto','implements','instanceof','interface','native','new','package',
    'private','protected','public','return','static','strictfp','super',
    'synchronized','this','throw','throws','transient','void','volatile'
  ]
  , specials = [
    'Byte','Short','Integer','Long','Float','Double','Boolean','Character','Number',
    'Iterable','Runnable','Thread','Error','Exception','Throwable','System','String','Object',
    'AbstractMethodError','AssertionError','ClassCircularityError','ClassFormatError','Deprecated',
    'EnumConstantNotPresentException','ExceptionInInitializerError','IllegalAccessError','IllegalThreadStateException',
    'InstantiationError','InternalError','NegativeArraySizeException','NoSuchFieldError','Override',
    'Process','ProcessBuilder','SecurityManager','StringIndexOutOfBoundsException','SuppressWarnings',
    'TypeNotPresentException','UnknownError','UnsatisfiedLinkError','UnsupportedClassVersionError','VerifyError',
    'InstantiationException','IndexOutOfBoundsException','ArrayIndexOutOfBoundsException','CloneNotSupportedException',
    'NoSuchFieldException','IllegalArgumentException','NumberFormatException','SecurityException','Void',
    'InheritableThreadLocal','IllegalStateException','InterruptedException','NoSuchMethodException',
    'IllegalAccessException','UnsupportedOperationException','Enum','StrictMath','Package','Compiler',
    'Readable','Runtime','StringBuilder','Math','IncompatibleClassChangeError','NoSuchMethodError',
    'ThreadLocal','RuntimePermission','ArithmeticException','NullPointerException',
    'StackTraceElement','Appendable','StringBuffer','ThreadGroup','IllegalMonitorStateException',
    'StackOverflowError','OutOfMemoryError','VirtualMachineError','ArrayStoreException','ClassCastException',
    'LinkageError','NoClassDefFoundError','ClassNotFoundException','RuntimeException','ThreadDeath',
    'ClassLoader','Cloneable','Class','CharSequence','Comparable'
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
  
  function pushcontext(state) {
    state.context = { indent: state.indent + 1, prev: state.context };
  }
  function popcontext(state) {
    if (state.context.prev) state.context = state.context.prev;
  }
  
  return new CodePrinter.Mode({
    name: 'Java',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    lineComment: '//',
    indentTriggers: closeBrackets,
    matching: 'brackets',
    
    initialState: function() {
      return {
        indent: 0,
        classes: {},
        context: {
          indent: 0
        }
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
      }
      if (ch == '0' && stream.eat(/x/i)) {
        stream.eatWhile(/[0-9a-f]/i);
        return 'numeric hex';
      }
      if (ch == '@') {
        stream.eatWhile(wordRgx);
        return 'directive';
      }
      if (openBrackets.test(ch)) {
        if (ch == '{') {
          if (state.classdef) {
            state.classdef = undefined;
            pushcontext(state);
          }
          ++state.indent;
        }
        return 'bracket';
      }
      if (closeBrackets.test(ch)) {
        if (ch == '}') {
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
      if (/\d/.test(ch)) {
        stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/, true);
        return 'numeric';
      }
      if (/[a-z\$_\xa1-\uffff]/i.test(ch)) {
        var word = ch + stream.eatWhile(wordRgx);
        
        if (word == 'true' || word == 'false') {
          return 'builtin boolean';
        }
        if (word == 'import') {
          return 'keyword';
        }
        if (word == 'class') {
          state.classdef = true;
          return 'keyword';
        }
        if (stream.lastValue == 'import') {
          if (stream.isAfter(/^\s*\;/)) {
            state.classes[word] = true;
            return 'special';
          }
        }
        if (stream.lastValue == 'class' || state.classes[word] === true) {
          state.classes[word] = true;
          return 'special';
        }
        if (constants.indexOf(word) >= 0) {
          return 'builtin';
        }
        if (controls.indexOf(word) >= 0) {
          return 'control';
        }
        if (types.indexOf(word) >= 0) {
          return 'keyword type';
        }
        if (keywords.indexOf(word) >= 0) {
          return 'keyword';
        }
        if (specials.indexOf(word) >= 0) {
          return 'special';
        }
        if (stream.isAfter(/^\s*\(/)) {
          return 'function';
        }
      }
    },
    indent: function(stream, state) {
      var i = state.indent;
      if (stream.lastStyle == 'bracket bracket-open') {
        if (stream.isAfter(closeBrackets)) return [i, -1];
      }
      if (stream.isAfter(closeBrackets)) return i - 1;
      return i;
    },
    completions: function(stream, state) {
      return {
        values: specials.concat(Object.keys(state.classes)),
        search: 200
      }
    },
    snippets: {
      'in': {
        content: 'System.in'
      },
      'out': {
        content: 'System.out'
      },
      'print': {
        content: 'System.out.print();',
        cursorMove: -2
      },
      'println': {
        content: 'System.out.println();',
        cursorMove: -2
      },
      'psvm': {
        content: 'public static void main(String[] args) {}',
        cursorMove: -1
      }
    }
  });
});