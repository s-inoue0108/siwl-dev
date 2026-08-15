#!/bin/sh

set -eu

REPO="s-inoue0108/siwl-dev"
BINARY="siwl"
INSTALL_DIR="${HOME}/bin"

OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin)
    GOOS="darwin"
    ;;
  Linux)
    GOOS="linux"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    GOOS="windows"
    ;;
  *)
    echo "Unsupported OS: $OS" >&2
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64|amd64)
    GOARCH="amd64"
    ;;
  arm64|aarch64)
    GOARCH="arm64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH" >&2
    exit 1
    ;;
esac

VERSION="${VERSION:-$(curl -fsSL \
  "https://api.github.com/repos/${REPO}/releases/latest" |
  grep '"tag_name":' |
  sed -E 's/.*"([^"]+)".*/\1/')}"

FILENAME="${BINARY}-${GOOS}-${GOARCH}"

if [ "$GOOS" = "windows" ]; then
  FILENAME="${FILENAME}.exe"
fi

URL="https://github.com/${REPO}/releases/download/${VERSION}/${FILENAME}"

mkdir -p "$INSTALL_DIR"

echo "Downloading ${FILENAME}..."

curl -fL "$URL" -o "${INSTALL_DIR}/${BINARY}"
chmod +x "${INSTALL_DIR}/${BINARY}"

echo "Installed to ${INSTALL_DIR}/${BINARY}"