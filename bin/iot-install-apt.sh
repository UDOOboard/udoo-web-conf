#!/bin/bash

echo "Waiting APT to be ready..."
PID=`ps aux | grep "[a]pt.* update" |awk '{print $2}'`
while [ -e /proc/$PID ]
do
    sleep 1
done

DEBIAN_FRONTEND=noninteractive apt -y install udoo-iot-cloud-client
sync
sleep 3
