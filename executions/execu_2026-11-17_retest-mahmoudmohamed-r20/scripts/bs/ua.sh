#!/usr/bin/env bash
# bs/ua.sh <script.js> — browser as agent (own state r20-bs-agent.json)
D="$(cd "$(dirname "$0")" && pwd)"; (cd "$D" && node uia.js a "$D/$1")
