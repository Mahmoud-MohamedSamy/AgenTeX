eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) {} } await sleep(12000);
const deps = JSON.parse((await api('GET', B + 'departments?limit=20')).t).data; out.workflows = {}; for (const d of deps) { const r = await api('GET', B + 'workflows?module=tickets&departmentId=' + d.id); out.workflows[d.name] = r.s === 200 ? (JSON.parse(r.t).data || []).map(w => w.name) : r.s; }
out.da = JSON.parse((await api('GET', B + 'directAssignmentRules?departmentId=' + D)).t).data.map(r => r.name);
const tk = JSON.parse((await api('GET', B + 'tickets?limit=50&departmentId=' + D)).t).data || []; out.qaTickets = tk.filter(t => /qa zwf/i.test(t.subject)).length;
out.bin = (JSON.parse((await api('GET', B + 'recycleBin?limit=50')).t).data || []).filter(x => /QA ZWF|qa zwf/i.test(JSON.stringify(x))).length;
require('fs').writeFileSync('zchk.json', JSON.stringify(out, null, 1));
