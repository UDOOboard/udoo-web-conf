#!/bin/bash

PID=`ps aux | grep "[t]tyd -p 57126" |awk '{print $2}'`

if [ -z "$PID" ]; then
    echo "Starting APT Upgrade"
    ttyd -p 57126 -o tmux -f ./tmux.conf -L udoo-wcp new -A -s ttyd_apt_upgrade 'DEBIAN_FRONTEND=noninteractive apt -y dist-upgrade && sync' &
fi
