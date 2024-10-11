#!/bin/bash

# https://linuxcommand.net/getopts/#i-4
# https://qiita.com/blueskyarea/items/e1edd92e8b5fbadd3e70
# https://technicalnote.hatenablog.com/entry/2019/07/13/154019

function main() {
    local IS_F=false
    local IS_M=false
    local IS_D=false
    local IS_B=false
    local IS_S=false
    local IS_T=false
    local IS_V=false
    local IS_H=false
    local IS_I=false
    local CMD=""

    local BRANCH=""
    local FILENAME=""
    local MODEL=""

    parse "$@"
    process
}

function parse() {
    OPTIND=1
    while getopts "dtvhisb:f:m:" OPT; do
        case $OPT in
        f)
            IS_F=true
            FILENAME=$OPTARG
            ;;
        m)
            IS_M=true
            MODEL=$OPTARG
            ;;
        d)
            IS_D=true
            ;;
        b)
            IS_B=true
            BRANCH=$OPTARG
            ;;
        s)
            IS_S=true
            ;;
        t)
            IS_T=true
            ;;
        v)
            IS_V=true
            ;;
        h)
            IS_H=true
            ;;
        i)
            IS_I=true
            ;;
        \?)
            echo "This is unexpected option."
            ;;
        esac
    done
    shift $(expr "${OPTIND}" - 1)
    if [ $# -eq 1 ]; then
        CMD="$@"
    fi
}

function process() {
    if $IS_D; then
        pnpm -s run dev
    elif $IS_T; then
        echo "testing..."
        # pnpm -s run test
    elif $IS_B; then
        if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "edit" ] && [ "$BRANCH" != "develop" ]; then
            echo "invalid branch: $BRANCH"
            exit 0
        fi
        ROOTDIR=/d/Astro/siwl-dev
        cd $ROOTDIR
        DATE=$(date "+%F")
        echo "create deployment - $BRANCH / $DATE"

        # push
        git add .
        git commit -m "$DATE"
        git push origin $BRANCH

        # merge and deploy
        git switch main
        git merge $BRANCH
        git push origin main
        git switch $BRANCH

        cd "$ROOTDIR"/src/content

        echo "Complete!"
        echo "deployments: https://dash.cloudflare.com/36267a6e8ba52f5b9b2f32b9ffd99e7b/pages/view/siwl-dev"
    elif $IS_S; then
        ROOTDIR=/d/Astro/siwl-dev
        cd $ROOTDIR
        echo "sync"

        # pull
        git stash
        git pull origin main
        git stash pop
    elif $IS_F && $IS_M; then
        pnpm -s run siwl $CMD -f ${FILENAME} -m ${MODEL}
    elif $IS_F; then
        pnpm -s run siwl $CMD -f ${FILENAME}
    elif $IS_M; then
        pnpm -s run siwl $CMD -m ${MODEL}
    elif $IS_H; then
        pnpm -s run siwl -h
    elif $IS_V; then
        pnpm -s run siwl -v
    elif $IS_I; then
        echo "https://siwl.dev"
        echo "https://github.com/s-inoue0108/siwl-dev"
        echo "https://dash.cloudflare.com/36267a6e8ba52f5b9b2f32b9ffd99e7b/pages/view/siwl-dev"
    elif [ $CMD == "ls" ]; then
        pnpm -s run siwl ls
    else
        echo "Command is invalid."
        echo "Check: https://github.com/s-inoue0108/siwl-dev/blob/main/README.md#cli"
    fi
}

main "$@"
