#!/bin/sh

ROOTDIR=/d/Astro/siwl-dev/

ACTION=$1
FLAG_1=$2
COMMAND_1=$3
FLAG_2=$4
COMMAND_2=$5

if [ "$ACTION" == "dev" ]; then
    pnpm -s run dev
elif [ "$ACTION" == "deploy" ]; then
    cd $ROOTDIR
    DATE=$(date "+%F")
    echo "create deployment - $DATE"
    echo "running..."

    # push: edit branch
    git switch edit
    git add .
    git commit -m "edit: $DATE"
    git push origin edit

    # merge: edit to main
    git switch main
    git merge edit
    git push origin main
    git switch edit

    cd "$ROOTDIR"/src/content

    echo "Complete!"
    echo "deployments: https://dash.cloudflare.com/36267a6e8ba52f5b9b2f32b9ffd99e7b/pages/view/siwl-dev"
fi

pnpm -s run siwl ${ACTION} ${FLAG_1} ${COMMAND_1} ${FLAG_2} ${COMMAND_2}
