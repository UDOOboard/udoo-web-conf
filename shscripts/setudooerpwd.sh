#!/bin/sh
echo udooer:$1 | chpasswd
x11vnc -storepasswd $1 /etc/x11vnc.pass
