#!/bin/bash

H=`cat /sys/fsl_otp/HW_OCOTP_CFG0 |sed -e 's/0x//'`
L=`cat /sys/fsl_otp/HW_OCOTP_CFG1 |sed -e 's/0x//'`

SERIAL=$L$H
SERIAL=${SERIAL^^}

echo $SERIAL

