#!/usr/bin/env bash
# Usage: run.sh <snippet.js> [outfile] — runs prelude-desk.js + helpers-run.js + snippet in playwright-cli session ${SESSION:-ar}.
# With outfile: saves the JSON result and appends CREATED ids to after/created.jsonl (cleanup ledger). Raw output is kept in after/raw-<snippet>.log.
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; E="$P/executions/execu_2026-10-26_desk-activities-replies"
cd "$P"; OUT=$(timeout ${TMO:-170} node node_modules/@playwright/cli/playwright-cli.js -s=${SESSION:-ar} run-code "async page => { $(cat "$E/scripts/prelude-desk.js" "$E/scripts/helpers-run.js" "$E/scripts/$1") }" </dev/null 2>&1)
printf '%s\n' "$OUT" | grep -v -i 'authorization\|bearer' > "$E/after/raw-$1.log"
J=$(printf '%s\n' "$OUT" | awk '/^### Result/{f=1;next} /^### /{f=0} f')
if [ -z "$J" ]; then printf "%s\n" "$OUT" | head -c 3000; exit 1; fi
if [ -n "$2" ]; then printf '%s' "$J" | node "$E/scripts/save-result.js" "$2"; else printf '%s\n' "$J" | head -c ${MAXC:-8000}; fi
