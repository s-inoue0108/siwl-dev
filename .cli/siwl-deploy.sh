#!/bin/sh

ROOTDIR=/d/Astro/siwl-dev/

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