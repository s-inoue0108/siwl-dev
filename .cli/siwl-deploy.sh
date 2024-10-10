#!/bin/sh

cd /d/Astro/siwl-dev/
DATE=$(date "+%F")
echo $d

# push: edit branch
git switch edit
git add .
git commit -m "edit: $DATE"
git push origin edit

# sync: main branch
git switch main
git stash
git pull origin main
git stash pop

# merge: edit to main
git merge edit
git push origin main

cd /d/Astro/siwl-dev/src/content
