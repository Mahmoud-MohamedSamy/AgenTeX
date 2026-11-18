#!/usr/bin/env bash
# bp/c9.sh K 'json' — one F09 case
D="$(cd "$(dirname "$0")" && pwd)"; export K="$1" C="$2"; echo "== $K $C $(date -u +%H:%M:%SZ)"; bash "$D/uo.sh" u9.js
