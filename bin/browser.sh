#!/bin/bash

URL="http://127.0.0.1"

if [ -f /etc/udoo-web-conf/port ]; then
    URL=${URL}:$(cat /etc/udoo-web-conf/port | tr -d '[:space:]')
fi

x-www-browser $URL
