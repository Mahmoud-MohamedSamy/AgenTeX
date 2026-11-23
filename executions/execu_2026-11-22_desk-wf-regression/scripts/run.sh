#!/bin/bash
# usage: scripts/run.sh cases/xx.js   (runs lib.js + case as the owner, one saved sign-in)
cd "$(dirname "$0")"
f="$1"; tmp="../out/.run-$(basename "$f")"
cat lib.js "../$f" > "$tmp"
node api.js ndc-staging-owner "$tmp"
