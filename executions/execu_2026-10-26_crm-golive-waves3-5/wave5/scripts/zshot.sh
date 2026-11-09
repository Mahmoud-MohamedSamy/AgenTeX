#!/usr/bin/env bash
# zshot.sh <url> <name> — Zoho (session w5z, read-only): open url, wait until loaded, screenshot evidence/raw/z-<name>.png, print text
W="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave5"
[ -n "$1" ] && SESSION=w5z TMO=150 "$W/scripts/ui.sh" goto "$1" >/dev/null
SESSION=w5z TMO=200 "$W/scripts/ui.sh" run-code "async page => { for (let i = 0; i < 40; i++) { await page.waitForTimeout(2000); const t = await page.innerText('body').catch(() => ''); if (!/^\s*Loading/.test(t) && t.length > 200) break; } await page.waitForTimeout(3000); await page.screenshot({ path: '$W/evidence/raw/z-$2.png' }); const t = (await page.innerText('body')).replace(/\s+/g, ' '); return t.slice(0, ${LEN:-700}); }" | grep -A1 "### Result" | tail -1
