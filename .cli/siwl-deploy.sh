#!/bin/sh

ROOTDIR=/d/Astro/siwl-dev/

cd $ROOTDIR
DATE=$(date "+%F")
echo $DATE

# push: edit branch
git switch edit &
>/dev/null
git add . &
>/dev/null
git commit -m "edit: $DATE" &
>/dev/null
git push origin edit &
>/dev/null

# sync: main branch
# git switch main &
# >/dev/null
# git stash &
# >/dev/null
# git pull origin main &
# >/dev/null
# git stash pop &
# >/dev/null

# merge: edit to main
git merge edit &
>/dev/null
git push origin main &
>/dev/null
git switch edit &
>/dev/null

cd "$ROOTDIR"/src/content

echo "Complete!"
echo "deployments: https://dash.cloudflare.com/36267a6e8ba52f5b9b2f32b9ffd99e7b"
