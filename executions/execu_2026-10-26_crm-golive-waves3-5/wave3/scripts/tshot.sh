#!/usr/bin/env bash
# tshot.sh "<visible link text>" <out.png> : click a TAVI Settings link in session w3t, wait for loading to end, screenshot.
timeout 120 playwright-cli -s=w3t goto https://staging-crm.taviportal.com/settings >/dev/null 2>&1; sleep 6
ref=$(timeout 60 playwright-cli -s=w3t snapshot 2>&1 | grep -m1 -E "(link|button) \"$1\"" | grep -o 'ref=[a-z0-9]*' | cut -d= -f2)
[ -n "$ref" ] && timeout 60 playwright-cli -s=w3t click "$ref" >/dev/null 2>&1
for i in 1 2 3 4 5 6 7 8 9 10; do sleep 4; t=$(timeout 60 playwright-cli -s=w3t eval "() => document.body.innerText.slice(0,2000)" 2>&1 | grep '^"'); case "$t" in *Loading*) ;; *) break;; esac; done
timeout 60 playwright-cli -s=w3t screenshot --filename="$2" >/dev/null 2>&1; echo "$1 -> $(basename "$2") (ref $ref)"
