#!/usr/bin/env bash
# Runs one screen-test selection in automation-w3 and saves its log, run summary and healing report under phase0/runs/<name>.
# Usage: run-ui.sh <name> <account> <test selector> [extra -D flags...]
name=$1; acct=$2; sel=$3; shift 3
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/phase0/runs/$name"; mkdir -p "$P"
cd "D:/Software Testing/Automation/Agentex Installation/Agentex Installation/automation-w3" || exit 1
rm -rf target/healing target/run-summary.json
./mvnw -o test "-Dtest=$sel" -Dbase.url=https://staging-crm.taviportal.com "-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv" -Dcredentials.host=staging-crm.taviportal.com "-Dcredentials.account=$acct" "$@" > "$P/run.log" 2>&1
cp target/run-summary.json "$P/" 2>/dev/null; cp target/healing/healing-report.json "$P/" 2>/dev/null
grep -E "Tests run:" "$P/run.log" | tail -1
node -e "try{const h=require('$P/healing-report.json');const a=Array.isArray(h)?h:(h.events||h.entries||Object.values(h));const c={};a.forEach(e=>c[e.status||e.type]=(c[e.status||e.type]||0)+1);console.log('healing',JSON.stringify(c))}catch(e){console.log('healing: none')}"
node -e "try{const s=Object.values(require('$P/run-summary.json'));s.filter(x=>!/PASS/.test(x.status)).forEach(x=>console.log(' ',x.status,x.test||x.method,String(x.error||'').replace(/\s+/g,' ').slice(0,200)))}catch(e){}"
