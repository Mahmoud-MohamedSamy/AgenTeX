#!/usr/bin/env bash
# bs/uo.sh <script.js> — browser as owner through shared ui.js (who=o)
D="$(cd "$(dirname "$0")" && pwd)"; (cd "$D/.." && node ui.js o "$D/$1")
