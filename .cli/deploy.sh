#!/bin/bash

provider=$1
current_branch=$(git branch --contains | cut -d " " -f 2)
main_branch="main"
now=$(date +"%Y-%m-%d %H:%M")

if [[ "$current_branch" == "$main_branch" ]]; then
  echo "[ERROR] You can't deploy from [main] branch."
  echo "Please try 'git switch <branch-name>'."
  exit 1
fi

echo -e "\e[1m\e[95m[$now] Deploying from $current_branch\e[0m"

git add .
git commit -m "[$now] deploy from $current_branch"
git push origin "$current_branch"

git switch "$main_branch"
git merge "$current_branch"
git push origin "$main_branch"

git switch "$current_branch"

if [ "$provider" == "--zenn" ]; then
  git subtree push --prefix=zenn zenn main
fi

echo -e "\e[1m\e[92mDeployed successfully.\e[0m"
