#!/bin/bash

current_branch=$(git branch --contains | cut -d " " -f 2)
main_branch="main"

if [[ "$current_branch" != "$main_branch" ]]; then
  echo "[ERROR] You can't deploy from [main] branch."
  echo "Please try 'git switch <branch-name>'."
  exit 1
fi

echo $current_branch
