CodePrinter.defineAddon('shortcuts', function() {
  
  var shortcuts = {
    'Cmd Backspace': function() {
      this.deleteToBeginning();
    },
    'Cmd Delete': function() {
      this.deleteToEnd();
    },
    'Alt Up': CodePrinter.prototype.searchPrev,
    'Alt Down': CodePrinter.prototype.searchNext,
    'Cmd Alt Up': CodePrinter.prototype.swapLineUp,
    'Cmd Alt Down': CodePrinter.prototype.swapLineDown,
    'Cmd D': CodePrinter.prototype.nextDefinition,
    'Cmd Alt D': CodePrinter.prototype.previousDefinition,
    'Cmd F': function() {
      var p = prompt('Find...');
      p ? this.search(p) : this.searchEnd();
    },
    'Cmd Shift F': function() {
      this.isFullscreen ? this.exitFullscreen() : this.enterFullscreen();
    },
    'Cmd I': function() {
      this.reIndent();
    },
    'Cmd J': function() {
      this.setCursorPosition(parseInt(prompt("Jump to line..."), 10) - 1, 0);
    },
    'Cmd M': function() {
      this.toggleMarkCurrentLine();
    },
    'Cmd N': function() {
      this.counter.hasClass('hidden') ? this.openCounter() : this.closeCounter();
    },
    'Cmd Z': function() {
      this.doc.undo();
    },
    'Cmd Shift Z': function() {
      this.doc.redo();
    },
    'Cmd ]': function() {
      this.indent();
    },
    'Cmd [': function() {
      this.unindent();
    },
    'Cmd =': CodePrinter.prototype.increaseFontSize,
    'Cmd -': CodePrinter.prototype.decreaseFontSize,
    'Cmd /': CodePrinter.prototype.toggleComment,
    'Cmd Shift /': CodePrinter.prototype.toggleBlockComment,
    'Cmd Left': function() {
      this.caret.position(this.caret.line(), 0);
    },
    'Cmd Right': function() {
      this.caret.position(this.caret.line(), -1);
    },
    'Cmd Up': function() {
      this.caret.position(0, 0);
    },
    'Cmd Down': function() {
      this.caret.position(this.doc.size() - 1, -1);
    }
  }
  
  return function(cp, options) {
    for (var k in shortcuts) {
      cp.keyMap[k] = shortcuts[k];
    }
  }
});