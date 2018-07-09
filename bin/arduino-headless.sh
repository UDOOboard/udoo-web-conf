#!/usr/bin/env bash

SCREEN=3

Xvfb :$SCREEN -nolisten tcp -screen :$SCREEN 1280x800x24 &

xvfb="$!"

DISPLAY=:$SCREEN arduino $@ 2>&1
ret_code=$?

kill -9 $xvfb

if [ ${ret_code} = 0 ]; then
    exit 0
else
    exit 1
fi

