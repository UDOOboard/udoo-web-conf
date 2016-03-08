# UDOO Board Web Configuration Tool

## Features
This application allows to quickly use your new UDOO board:

 * view IP and hardware addresses of the network interfaces
 * connect to WiFi networks
 * access 9-axis sensor values
 * run simple pre-built Arduino sketches
 * develop your own Arduino sketch (writing code or dragging blocks via [Ardublockly](https://github.com/carlosperate/ardublockly))
 * change the password used to access the board
 * set your regional settings (timezone and locale)
 * change the main video output port (HDMI, LVDS)

## Board support

* UDOO Neo (all editions)

UDOO Quad/Dual are also able to run this application, but it is not officially supported for the moment.

## Change TCP port
By default, this tool uses port TCP 80. If you want to change the port run the following command as root:

    echo 8080 > /etc/udoo-web-conf/port

If you want to totally disable this tool:

    echo manual > /etc/init/udoo-web-conf.override

## Architecture
This is a standard NodeJS application using the Express 4 framework and Socket.io for displaying 9-axis sensor values.

The files in the `route/` directory define the URLs for the pages of the application. A route renders a view (from `views/`) after eventually processing some information. The scripts in `shscripts/` are invoked by views in order to change some settings or display information on the pages.

The `public/` directory is accessible from the web browser, and contains all the layout files, like JavaScript and CSS files.

The Arduino sketches developed within this app are written in `mysketch/mysketch.ino`, which is compiled by the standard Arduino IDE preinstalled in UDOObuntu. Arduino IDE takes care of flashing the M4 core too.