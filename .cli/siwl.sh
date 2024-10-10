#!/bin/sh

ACTION=$1
FLAG_1=$2
COMMAND_1=$3
FLAG_2=$4
COMMAND_2=$5

pnpm -s run siwl ${ACTION} ${FLAG_1} ${COMMAND_1} ${FLAG_2} ${COMMAND_2}
