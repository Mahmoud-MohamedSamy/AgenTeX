#!/usr/bin/env bash
# zrun2.sh <file.js> — run on the Zoho server (8897) with zlib.js + zdlib.js helpers in scope; masks emails
cd "$(dirname "$0")"
node zwrap.js "$1"
