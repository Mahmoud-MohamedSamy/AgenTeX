const r = await page.context().request.get(H + '/assets/index-C2vuer73.js'); const t = await r.text();
const out = { len: t.length, st: r.status() }; const pats = new Set();
for (const m of t.matchAll(/[^\n]{0,40}(split|translat|ai\/summar|summary|triage|draft-assist|reply-suggest|clone|\/print)[^\n]{0,60}/gi)) { const s = m[0]; if (/tickets|\/ai|desk/.test(s)) pats.add(s.replace(/\s+/g, ' ')); if (pats.size > 70) break; }
out.p = [...pats];
return JSON.stringify(out);
