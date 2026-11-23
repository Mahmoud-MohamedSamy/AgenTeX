await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
const api = (m, p, b) => page.evaluate(async ([m, p, b]) => { const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined, credentials: 'include' }); return { s: r.status, t: await r.text() }; }, [m, p, b]);
const B = '/supportapi/zd/techegysolutions/api/v1/';
const deps = JSON.parse((await api('GET', B + 'departments?limit=20')).t).data; out.depts = deps.map(d => d.name + '=' + d.id);
for (const d of deps) { const r = await api('GET', B + 'workflows?module=tickets&departmentId=' + d.id); out['wf ' + d.name] = r.s + ' ' + r.t.slice(0, 1500); }
const fs = require('fs'); fs.writeFileSync('zp2.json', JSON.stringify(out, null, 1));
