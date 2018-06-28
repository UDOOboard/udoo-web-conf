#!/usr/bin/env bash

SCREEN=3

Xvfb :$SCREEN -nolisten tcp -screen :$SCREEN 1280x800x24 &

xvfb="$!"

DISPLAY=:$SCREEN arduino $@ 2>&1


kill -9 $xvfb
