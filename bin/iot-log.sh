#!/bin/bash

PID=`ps aux | grep "[t]tyd -p 57127" |awk '{print $2}'`

if [ -z "$PID" ]; then
    if hash journalctl 2>/dev/null; then
        ttyd -p 57127 tmux -f ./tmux.conf -L udoo-wcp new -A -s ttyd_iot_log 'journalctl -fu udoo-iot-cloud-client.service' &
    else
        ttyd -p 57127 tmux -f ./tmux.conf -L udoo-wcp new -A -s ttyd_iot_log 'tail -f -n +1 /var/log/upstart/udoo-iot-cloud-client.log' &
    fi
fi
