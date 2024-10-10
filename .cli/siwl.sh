#!/bin/sh

ACTION=$1
FLAG_1=$2
COMMAND_1=$3
FLAG_2=$4
COMMAND_2=$5

if [ "$ACTION" = "dev" ] || [ "$ACTION" = "serve" ]; then
    if [ "$FLAG_1" = "-h" ] || [ "$FLAG_1" = "--host" ]; then
        pnpm -s run dev --host
    else
        pnpm -s run dev
    fi
elif [ "$ACTION" = "build" ]; then
    pnpm -s run build
elif [ "$ACTION" = "preview" ]; then
    pnpm -s run preview
elif [ "$ACTION" = "apply" ]; then
    git switch main
    git stash
    git pull origin main
    git stash pop
elif [ "$ACTION" = "deploy" ]; then
    git switch edit
    git add .
    if [ "$FLAG_1" = "-m" ] || [ "$FLAG_1" = "--message" ]; then
        git commit -m "edit: $COMMAND_1"
    else
        git commit -m ""
    fi
    git push origin edit
    git switch main
    git merge edit
    git push origin main
    git switch edit
fi

pnpm -s run siwl ${ACTION} ${FLAG_1} ${COMMAND_1} ${FLAG_2} ${COMMAND_2}
