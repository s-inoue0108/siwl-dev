#!/bin/bash

current_branch=$(git branch --contains | cut -d " " -f 2)
main_branch="main"
now=$(date +"%Y-%m-%d %H:%M")

if [[ "$current_branch" == "$main_branch" ]]; then
  echo "[ERROR] You can't deploy from [main] branch."
  echo "Please try 'git switch <branch-name>'."
  exit 1
fi

echo -e "\e[1m\e[95m[$now] Deploying from $current_branch\e[0m"

git add . >/dev/null
git commit -m "[$now] deploy from $current_branch" >/dev/null
git push origin "$current_branch" >/dev/null

git switch "$main_branch" >/dev/null
git merge "$current_branch" >/dev/null
git push origin "$main_branch" >/dev/null

git switch "$current_branch" >/dev/null

echo -e "\e[1m\e[92mDeployed successfully.\e[0m"
