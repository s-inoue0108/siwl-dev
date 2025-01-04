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

if [ "$provider" == "--zenn" ]; then
  git add zenn/*
  git commit -m "[$now] deploy from $current_branch"
  git push origin "$current_branch"

  git switch "$main_branch"
  git merge "$current_branch"
  git push origin "$main_branch"

  git switch "$current_branch"

  now=$(date +"%Y-%m-%d %H:%M")
  echo -e "\e[1m\e[95m[$now] Push to zenn/main\e[0m"

  git subtree push --prefix=zenn zenn main
elif [ "$provider" == "--qiita" ]; then
  git add qiita/*
  git commit -m "[$now] deploy from $current_branch"
  git push origin "$current_branch"

  git switch "$main_branch"
  git merge "$current_branch"
  git push origin "$main_branch"

  git switch "$current_branch"

  now=$(date +"%Y-%m-%d %H:%M")
  echo -e "\e[1m\e[92m[$now] Push to qiita/main\e[0m"

  git subtree push --prefix=qiita qiita main
else
  git add .
  git commit -m "[$now] deploy from $current_branch"
  git push origin "$current_branch"

  git switch "$main_branch"
  git merge "$current_branch"
  git push origin "$main_branch"

  git switch "$current_branch"
fi

echo -e "\e[1m\e[92mDeployed successfully.\e[0m"
