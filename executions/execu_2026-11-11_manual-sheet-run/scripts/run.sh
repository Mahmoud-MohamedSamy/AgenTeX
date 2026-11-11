#!/bin/bash
# ./run.sh <mode> [account-idx state] : runs ms.js mode; on SIGNED_OUT signs in once and reruns.
M=$1; IDX=${2:-7}; S=${3:-owner}; source "$(dirname "$0")/env.sh"; cd "$(dirname "$0")"
OUTP=$(ST=$S node ms.js $M 2>&1); if echo "$OUTP" | grep -q SIGNED_OUT; then timeout 280 node login.js $IDX ../out/$S.json "NDC-Staging" 2>&1 | tail -1; OUTP=$(ST=$S node ms.js $M 2>&1); fi
echo "$OUTP" | tail -${TL:-80}
