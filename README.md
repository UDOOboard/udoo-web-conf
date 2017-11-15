# UDOO Board Web Control Panel

## Features
This application allows to quickly use your new UDOO board:

 * view IP and hardware addresses of the network interfaces
 * connect to WiFi networks
 * plot 9-axis sensor values
 * run simple pre-built Arduino sketches
 * develop your own Arduino sketch (writing code or dragging blocks via [Ardublockly](https://github.com/carlosperate/ardublockly))
 * change the passwords used to access the board
 * set your regional settings (timezone and locale)
 * change the main video output port (HDMI, LVDS)

## Board support

* UDOO Neo (all editions)

UDOO Quad/Dual are also able to run this application, but it is not officially supported for the moment.

## Change TCP port
By default, this tool uses port TCP 80. If you want to change the port run the following command as root:

    echo 8080 > /etc/udoo-wcp/port

If you want to totally disable this tool:

    echo manual > /etc/init/udoo-wcp.override

