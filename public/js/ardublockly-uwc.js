/**
 * @fileoverview JavaScript to configure Ardublockly front end for
 *     UDOO-web-conf.
 */
'use strict';

/** Create a namespace for the application. */
var Ardublockly = Ardublockly || {};

/** Initialize function for Ardublockly on page load. */
Ardublockly.init = function() {
  // Inject Blockly into content_blocks
  Ardublockly.injectBlockly(
      document.getElementById('content_blocks'),
      Ardublockly.TOOLBOX_XML,
      '/ardublockly/blockly/');

  Ardublockly.designJsInit();

  Ardublockly.bindEventListeners();
  Ardublockly.bindBlocklyEventListeners();
};

/** Initialises all the design related JavaScript. */
Ardublockly.designJsInit = function() {
  Ardublockly.resizeToggleToolboxButton();
};

/** Binds the event listeners relevant to the page design. */
Ardublockly.bindEventListeners = function() {
  // Resize blockly workspace on window resize
  window.addEventListener('resize', Ardublockly.resizeBlocklyWorkspace, false);

  // General buttons
  Ardublockly.bindClick_('button_new', Ardublockly.discardAllBlocks);
  Ardublockly.bindClick_('button_load', Ardublockly.loadUserXmlFile);
  Ardublockly.bindClick_('button_save', Ardublockly.saveXmlFile);
  Ardublockly.bindClick_('button_upload', Ardublockly.sendCode);
  Ardublockly.bindClick_('button_toggle_toolbox', Ardublockly.toogleToolbox);

  // Load examples buttons
  Ardublockly.bindClick_('menu_example_blink', function() {
    $('[data-toggle="dropdown"]').parent().removeClass('open');
    Ardublockly.loadServerXmlFile('/ardublockly/examples/blink.xml');
  });
  Ardublockly.bindClick_('menu_example_serial', function() {
    $('[data-toggle="dropdown"]').parent().removeClass('open');
    Ardublockly.loadServerXmlFile(
        '/ardublockly/examples/serial_print_ascii_.xml');
  });
  Ardublockly.bindClick_('menu_example_serial_game', function() {
    $('[data-toggle="dropdown"]').parent().removeClass('open');
    Ardublockly.loadServerXmlFile(
        '/ardublockly/examples/serial_repeat_game.xml');
  });
  Ardublockly.bindClick_('menu_example_servo', function() {
    $('[data-toggle="dropdown"]').parent().removeClass('open');
    Ardublockly.loadServerXmlFile('/ardublockly/examples/servo_knob.xml');
  });
  Ardublockly.bindClick_('menu_example_setpper', function() {
    $('[data-toggle="dropdown"]').parent().removeClass('open');
    Ardublockly.loadServerXmlFile('/ardublockly/examples/stepper_knob.xml');
  });
};

/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Ardublockly.saveXmlFile = function() {
  Ardublockly.saveTextFileAs(
      'ardublockly_blocks.xml', Ardublockly.generateXml());
};

/**
 * Creates an Arduino Sketch file containing the Arduino code generated from
 * the Blockly workspace and prompts the users to save it into their local file
 * system.
 */
Ardublockly.saveSketchFile = function() {
  Ardublockly.saveTextFileAs(
      'ardublockly_sketch.ino', ArduBlockly.generateArduino());
};

/**
 * Send the Arduino Code to the ArdublocklyServer to process.
 * Shows a loader around the button, blocking it (unblocked upon received
 * message from server).
 */
Ardublockly.sendCode = function() {
  var arduinoCode = Ardublockly.generateArduino();
  Ardublockly.showLoader(true);
  
  $('#waitDialog div.loaded').addClass("hidden");
  $('#waitDialog div.error').addClass("hidden");
  
  $.ajax({
      type: "POST",
      url: '/arduino/compilesketch/',
      data: {
          sketch: arduinoCode
      },
      success: function(response) {
          Ardublockly.showLoader(false);
          if (response.success) {
              $('#waitDialog div.loaded').removeClass("hidden");
              $('#waitDialog').modal('show');
          } else {
              $('#waitDialog div.error').html(response.message).removeClass("hidden");
              $('#waitDialog').modal('show');
          }
      }
  });
};

/**
 * Sets the toolbox HTML element to be display or not and change the visibility
 * button to reflect the new state.
 * When the toolbox is visible it should display the "visibility-off" icon with
 * no background, and the opposite when toolbox is hidden.
 * @param {!boolean} show Indicates if the toolbox should be set visible.
 */
Ardublockly.displayToolbox = function(show) {
  var toolbox = $('.blocklyToolboxDiv');
  var toolboxTree = $('.blocklyTreeRoot');
  var button = document.getElementById('button_toggle_toolbox');
  var buttonIcon = document.getElementById('button_toggle_toolbox_icon');

  // Because firing multiple clicks can confuse the animation, create an overlay
  // element to stop clicks (due to the materialize framework controlling the
  // event listeners is better to do it this way for easy framework update).
  var elLocation = $('#button_toggle_toolbox').offset();
  jQuery('<div/>', {
      id: 'toolboxButtonScreen',
      css: {
        position: 'fixed',
        top: elLocation.top,
        left: elLocation.left,
        height: $('#button_toggle_toolbox').height(),
        width: $('#button_toggle_toolbox').width(),
        cursor: 'pointer',
        zIndex: 12
      },
  }).appendTo('body');

  var classOn = 'button_toggle_toolbox_on';
  var classOff = 'button_toggle_toolbox_off';
  var visOn = 'fa fa-eye fa';
  var visOff = 'fa fa-eye-slash fa';
  if (show) {
    toolbox.show();
    button.className = button.className.replace(classOn, classOff);
    buttonIcon.className = buttonIcon.className.replace(visOn, visOff);
    toolbox.animate(
        {height: document.getElementById('content_blocks').style.height}, 300,
        function() {
          toolboxTree.css("overflow-y", "auto");
          Blockly.fireUiEvent(window, 'resize');
          $('#toolboxButtonScreen').remove();
        });
  } else {
    toolboxTree.css("overflow-y", "hidden");
    buttonIcon.className = buttonIcon.className.replace(visOff, visOn);
    toolbox.animate({height: 38}, 300, function() {
      button.className = button.className.replace(classOff, classOn);
      toolbox.fadeOut(350, 'linear', function() {
        Blockly.fireUiEvent(window, 'resize');
        setTimeout(function() { toolbox.height(38); }, 100);
        $('#toolboxButtonScreen').remove();
      });
    });
  }
};

/**
 * Resizes the button to toggle the toolbox visibility to the width of the
 * toolbox.
 * The toolbox width does not change with workspace width, so safe to do once,
 * but it needs to be done after blockly has been injected.
 */
Ardublockly.resizeToggleToolboxButton = function() {
  Blockly.fireUiEvent(window, 'resize');
  var button = $('#button_toggle_toolbox');
  // Sets the toolbox toggle button width to that of the toolbox
  if (Ardublockly.isToolboxVisible() && Ardublockly.blocklyToolboxWidth()) {
    // For some reason normal set style and getElementById didn't work
    button.width(Ardublockly.blocklyToolboxWidth());
    button[0].style.display = '';
  }
};

/** Resizes the container for the Blockly workspace. */
Ardublockly.resizeBlocklyWorkspace = function() {
  var contentBlocks = document.getElementById('content_blocks');
  var wrapperPanelSize =
      Ardublockly.getBBox_(document.getElementById('blocks_panel'));

  contentBlocks.style.top = wrapperPanelSize.y + 'px';
  contentBlocks.style.left = wrapperPanelSize.x + 'px';
  // Height and width need to be set, read back, then set again to
  // compensate for scrollbars.
  contentBlocks.style.height = wrapperPanelSize.height + 'px';
  contentBlocks.style.height =
      (2 * wrapperPanelSize.height - contentBlocks.offsetHeight) + 'px';
  contentBlocks.style.width = wrapperPanelSize.width + 'px';
  contentBlocks.style.width =
      (2 * wrapperPanelSize.width - contentBlocks.offsetWidth) + 'px';
};

/** @param {!boolean} show Indicates if it should show the loading bar. */
Ardublockly.showLoader = function(show) {
  var loader = document.getElementById('loading-bar');
  loader.style.display = show ? 'inline': 'none';
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Ardublockly.getBBox_ = function(element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};

/**
 * Interface to displays a short message, which disappears after a time out.
 * @param {!string} message Text to be temporarily displayed.
 */
Ardublockly.shortMessage = function(message) {
  //TODO: this
  console.log(message);
};

/**
 * Interface to display messages with a possible action.
 * @param {!string} title HTML to include in title.
 * @param {!element} body HTML to include in body.
 * @param {boolean=} confirm Indicates if the user is shown a single option (ok)
 *     or an option to cancel, with an action applied to the "ok".
 * @param {string=|function=} callback If confirm option is selected this would
 *     be the function called when clicked 'OK'.
 */
Ardublockly.alertMessage = function(title, body, confirm, callback) {
  var fullMessage = title + '\n' + body;
  if (confirm) {
    if (window.confirm(fullMessage)) {
        callback.call();
    }
  } else {
      window.alert(fullMessage);
  }
};

/** Unused feature from original Ardublockly, needs overwriting just in case. */
Ardublockly.openNotConnectedModal = function() {
  alert('Please ensure the UDOO-web-conf server is running.');
};

