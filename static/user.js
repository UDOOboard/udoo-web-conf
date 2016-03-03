if (window.tty) {
  tty.on('open', function () {
    window.tty.socket.on('connect', function() {
      var w = new window.tty.Window();
      // Race condition; do not like. Without this timeout, the
      // terminal is rendered slightly too high and spills off 
      // the top edge of the canvas. C'est la vie en JavaScript.
      setTimeout(function () {
        w.maximize();
      }, 100);
    });
  });
}