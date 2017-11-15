#!/bin/bash

PID=`ps aux | grep "[a]pt update" |awk '{print $2}'`

if [ -z "$PID" ]; then
    echo "Starting APT Update"
    DEBIAN_FRONTEND=noninteractive apt update && sync &
fi
