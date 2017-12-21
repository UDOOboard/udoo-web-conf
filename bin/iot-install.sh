#!/bin/bash

PID=`ps aux | grep "[t]tyd -p 57128" |awk '{print $2}'`

if [ -z "$PID" ]; then
    echo "Starting IoT install"
    ttyd -p 57128 -o tmux -f ./tmux.conf -L udoo-wcp new -A -s ttyd_iot_install './iot-install-apt.sh' &
fi
