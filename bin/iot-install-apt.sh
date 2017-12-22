#!/bin/bash

PID=`ps aux | grep "[a]pt.* update" |awk '{print $2}'`
if [ -n "$PID" ]; then
    echo "Waiting APT to be ready..."
    while [ -e /proc/$PID ]
    do
        sleep 1
    done
fi

echo "Installing UDOO IoT Cloud Client..."
apt update
DEBIAN_FRONTEND=noninteractive apt -y install udoo-iot-cloud-client
RES=$?

if [ $RES -eq 0 ]; then
    echo "Installation complete!"
    sync
    sleep 3
else
    echo "Installation failed!"
    sleep 15
fi
