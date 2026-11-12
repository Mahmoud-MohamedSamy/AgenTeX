#!/usr/bin/env bash
# zapi.sh <body.js>: runs body inside the Zoho page with helpers z(method, path, body) -> {s, j|t}. Path relative to /api/v1.
body=$(cat "$1")
cat > /tmp/zapi-wrap.js <<WRAP
async (page) => page.evaluate(async () => {
  const csrf = (document.cookie.match(/(?:^|; )crmcsr=([^;]+)/)||[])[1];
  const z = async (m, p, b) => { const r = await fetch('/api/v1' + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '944875504', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });
    const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 1500) }; };
  const DEPT = '1475109000000426945';
  $body
});
WRAP
bash "$(dirname "$0")/z.sh" /tmp/zapi-wrap.js
