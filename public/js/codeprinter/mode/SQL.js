/* CodePrinter - SQL Mode */

CodePrinter.defineMode('SQL', function() {
  
  var keyMap = {}
  , operatorsRgx = /[\-+=<>%]/
  , atoms = ['false','true','null','unknown']
  , builtins = [
    'bool','boolean','bit','blob','enum','long','longblob','longtext',
    'medium','mediumblob','mediumint','mediumtext','time','timestamp',
    'tinyblob','tinyint','tinytext','text','bigint','int','int1','int2',
    'int3','int4','int8','integer','float','float4','float8','double',
    'char','varbinary','varchar','varcharacter','precision','real','null',
    'date','datetime','year','unsigned','signed','decimal','numeric'
  ]
  , controls = [
    'else','end','if','then','when'
  ]
  , operators = [
    'all','and','any','between','exists','in','like','not','or','is','unique'
  ]
  , keywords = [
    'add','alter','as','asc','by','clustered','collate','collation','collations',
    'column','columns','commit','constraint','count','create','declare','delete',
    'desc','distinct','drop','for','foreign','from','group','having','inner','index',
    'insert','into','join','key','nonclustered','left','on','order','outer','primary',
    'procedure','right','rollback','savepoint','select','set','table','to','trigger',
    'union','update','use','values','view','where'
  ];
  
  function string(stream, state) {
    var ch;
    while (ch = stream.next()) {
      if (ch == state.quote) {
        if (state.quote == "'") {
          if (stream.peek() == "'") {
            stream.undo(1);
            state.next = escapedString;
            return 'string';
          }
        }
        break;
      }
    }
    if (ch) state.next = state.quote = undefined;
    else state.next = string;
    return 'string';
  }
  function escapedString(stream, state) {
    if (stream.eat("'") && stream.eat("'")) {
      state.next = string;
      return 'escaped';
    }
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
  
  return new CodePrinter.Mode({
    name: 'SQL',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    lineComment: '--',
    indentTriggers: /d/,
    matching: 'brackets',
    
    initialState: function() {
      return {
        indent: 0
      }
    },
    iterator: function(stream, state) {
      var ch = stream.next();
      if (state.then) {
        state.then = undefined;
        --state.indent;
      }
      if (ch == "'" || ch == '"' || ch == '`') {
        state.quote = ch;
        return string(stream, state);
      }
      if (ch == '/' && stream.eat('*')) {
        return comment(stream, state);
      }
      if (ch == '-' && stream.eat('-')) {
        stream.skip();
        return 'comment';
      }
      if (ch == '*') {
        return 'parameter';
      }
      if (ch == '(' || ch == ')') {
        return 'bracket';
      }
      if (ch == '@') {
        stream.eatWhile(/\w/);
        return 'variable';
      }
      if (/\d/.test(ch)) {
        stream.match(/^\d*\.?\d+/, true);
        return 'numeric';
      }
      if (operatorsRgx.test(ch)) {
        stream.eatWhile(operatorsRgx);
        return 'operator';
      }
      if (/[a-z]/i.test(ch)) {
        var word = (ch + stream.eatWhile(/\w/)).toLowerCase();
        if (word == 'end') {
          --state.indent;
          return 'control';
        }
        if (word == 'begin' || word == 'case' || (word == 'when' && !stream.isAfter(/\bthen\b/))) {
          ++state.indent;
          return 'control';
        }
        if (word == 'then') {
          if (stream.isAfter(/\w/)) {
            state.then = true;
          }
          return 'control';
        }
        if (atoms.indexOf(word) >= 0) return 'builtin boolean';
        if (builtins.indexOf(word) >= 0) return 'builtin';
        if (controls.indexOf(word) >= 0) return 'control';
        if (operators.indexOf(word) >= 0) return 'operator';
        if (keywords.indexOf(word) >= 0) return 'keyword';
        if (stream.isAfter('.') || stream.isBefore(/use\s+$/i, -word.length)) return 'namespace';
        if (stream.isAfter('(')) return 'function';
        if (stream.pos != 0 && stream.lastStyle != 'special') return 'special';
      }
    },
    indent: function(stream, state) {
      if (stream.isAfter(/^end/i)) return state.indent - 1;
      return state.indent;
    }
  });
});