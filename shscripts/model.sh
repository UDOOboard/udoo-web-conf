#!/bin/bash

MOUNTED=0
NOTMOUNTED=1

FULL=1
EXTENDED=2
BASIC=3
BASICKS=4


function gpio_init_recognition()
{
  if 	[ ! -f /sys/class/gpio/gpio109/direction ] || 
      [ ! -f /sys/class/gpio/gpio96/direction ] 
  then
    
    echo 109 > /sys/class/gpio/export # R184
    echo 96 > /sys/class/gpio/export  # R185
    echo in > /sys/class/gpio/gpio109/direction # R184
    echo in > /sys/class/gpio/gpio96/direction  # R185
  fi
}

function board_version_recognition()
{

  gpio_init_recognition


  R184=$(get_gpio_value 109) # R184
  R185=$(get_gpio_value 96)  # R185

  [[ ! -n $R184 ]] && [[ ! -n $R185 ]] && log "- RECOGNITION ERROR" 1

  if [ $R184 -eq $NOTMOUNTED ] && [ $R185 -eq $MOUNTED ]; then
    BOARD_MODEL='FULL'
  elif [ $R184 -eq $NOTMOUNTED ] && [ $R185 -eq $NOTMOUNTED ]; then
    BOARD_MODEL='EXTENDED'
  elif [ $R184 -eq $MOUNTED ] && [ $R185 -eq $MOUNTED ]; then
    BOARD_MODEL='BASIC'
  elif [ $R184 -eq $MOUNTED ] && [ $R185 -eq $NOTMOUNTED ]; then
    BOARD_MODEL='BASIC KICKSTARTER'
  fi
}


log()
{
  echo "$1" 
  (( $2 )) || return 0
  exit $2
}


function get_gpio_value()
{

  local GPIO_NR
  local VALUE

  (( $1 > 0 )) && (( $1 < 192 )) && GPIO_NR=$1

  [ -v GPIO_NR ] || log "- get_gpio_value: gpio number not valid" 1

  #reading register
  VALUE=$(cat /sys/class/gpio/gpio${GPIO_NR}/value)

  echo $VALUE 
}

board_version_recognition

echo "$BOARD_MODEL"
