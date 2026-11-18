#!/usr/bin/env bash
# bp/ua.sh <script.js> — browser as agent CES2 (own state f21-bp-a.json)
D="$(cd "$(dirname "$0")" && pwd)"; (cd "$D" && node uia.js a "$D/$1")
