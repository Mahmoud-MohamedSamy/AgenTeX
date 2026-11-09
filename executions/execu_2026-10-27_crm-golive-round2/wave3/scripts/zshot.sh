#!/usr/bin/env bash
# zshot.sh "<Setup link text>" <out.png> : click a Zoho Setup sidebar link in session w3z, wait until loaded, screenshot (read-only).
ref=$(timeout 60 playwright-cli -s=w3z snapshot 2>&1 | grep -m1 "link \"$1\"" | grep -o 'ref=[a-z0-9]*' | cut -d= -f2)
[ -n "$ref" ] && timeout 60 playwright-cli -s=w3z click "$ref" >/dev/null 2>&1
for i in 1 2 3 4 5 6 7 8; do sleep 5; t=$(timeout 60 playwright-cli -s=w3z eval "() => document.body.innerText.slice(0,300)" 2>&1 | grep '^"'); case "$t" in *Loading*) ;; *) break;; esac; done
timeout 60 playwright-cli -s=w3z screenshot --filename="$2" >/dev/null 2>&1; echo "$1 -> $2 (ref $ref)"
