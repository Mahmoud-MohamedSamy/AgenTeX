#!/usr/bin/env bash
# shot.sh <name> — screenshot of session w5 into evidence/raw/<name>.png plus the visible text of the content area
W="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave5"
"$W/scripts/ui.sh" screenshot --filename="$W/evidence/raw/$1.png" >/dev/null
"$W/scripts/ui.sh" eval "() => { const m = document.querySelector('main'); const t = m ? m.innerText : document.body.innerText; const i = t.indexOf('Storage Requests'); return (i > 0 ? t.slice(i + 16) : t).replace(/\n+/g, ' | ').slice(0, ${LEN:-900}); }" | grep '^"'
