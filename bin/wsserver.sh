#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
DIR=$(dirname "$SOURCE")

PID=`ps aux | grep "[p]hp .*wsserver\.php wsserver"|awk '{print $2}'`

if [ -z "$PID" ]; then
    echo "Starting WS Server"
    php $DIR/wsserver.php wsserver &
fi
