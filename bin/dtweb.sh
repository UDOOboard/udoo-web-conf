#!/bin/bash

PID=`ps aux | grep "[d]tweb-headless"| awk '{print $2}'`

if [ -z "$PID" ]; then
    echo "Starting device tree editor"
    /opt/dtweb/dtweb-headless.sh &
fi
