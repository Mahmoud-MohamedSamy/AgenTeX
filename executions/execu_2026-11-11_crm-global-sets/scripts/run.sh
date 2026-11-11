#!/usr/bin/env bash
# run.sh <step.js> [account]  — runs common.js + step as that account (default owner)
D="$(cd "$(dirname "$0")" && pwd)"; cat "$D/common.js" "$1" > "$D/.cur.js"; cd "$D"; OUT=../out APP=crm node api.js "${2:-ndc-staging-owner}" .cur.js
