#!/bin/bash

url=$1

if [ -z "$url" ]; then
  echo "[ERROR] unspecified url."
  exit 1
fi

# OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  open_command="xdg-open" # Linuxでは通常 xdg-open を使用
elif [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open_command="open"
elif [[ "$OSTYPE" == "cygwin" ]]; then
  # Cygwin（Windows/Unix)
  open_command="start"
elif [[ "$OSTYPE" == "msys" ]]; then
  # Windows（MSYS2）
  open_command="start"
elif [[ "$OSTYPE" == "win32" ]]; then
  # Windows
  open_command="start"
else
  echo "unknown OS: $OSTYPE"
  exit 1
fi

echo "$open_command $url"

$open_command "$url"
