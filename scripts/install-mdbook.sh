#!/usr/bin/env bash
set -euo pipefail

if command -v mdbook >/dev/null 2>&1; then
  echo "mdBook already available: $(mdbook --version)"
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
MDBOOK_VERSION="${MDBOOK_VERSION:-0.4.52}"
BIN_DIR="${ROOT_DIR}/node_modules/.bin"

case "$(uname -s)" in
  Linux)
    OS_TARGET="unknown-linux-gnu"
    ;;
  *)
    echo "install-mdbook.sh only installs mdBook automatically on Linux." >&2
    echo "Install mdBook locally from https://rust-lang.github.io/mdBook/guide/installation.html" >&2
    exit 1
    ;;
esac

case "$(uname -m)" in
  x86_64 | amd64)
    ARCH_TARGET="x86_64"
    ;;
  aarch64 | arm64)
    ARCH_TARGET="aarch64"
    ;;
  *)
    echo "Unsupported Linux architecture for mdBook install: $(uname -m)" >&2
    exit 1
    ;;
esac

TARGET="${ARCH_TARGET}-${OS_TARGET}"
ARCHIVE_NAME="mdbook-v${MDBOOK_VERSION}-${TARGET}.tar.gz"
DOWNLOAD_URL="https://github.com/rust-lang/mdBook/releases/download/v${MDBOOK_VERSION}/${ARCHIVE_NAME}"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

echo "Installing mdBook v${MDBOOK_VERSION} for ${TARGET}..."
mkdir -p "${BIN_DIR}"

curl -fsSL "${DOWNLOAD_URL}" -o "${TMP_DIR}/${ARCHIVE_NAME}"
tar -xzf "${TMP_DIR}/${ARCHIVE_NAME}" -C "${TMP_DIR}"
install -m 0755 "${TMP_DIR}/mdbook" "${BIN_DIR}/mdbook"

"${BIN_DIR}/mdbook" --version
