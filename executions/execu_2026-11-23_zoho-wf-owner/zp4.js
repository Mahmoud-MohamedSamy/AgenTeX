await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
const api = (m, p, b) => page.evaluate(async ([m, p, b]) => { const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined, credentials: 'include' }); return { s: r.status, t: await r.text() }; }, [m, p, b]);
const B = '/supportapi/zd/techegysolutions/api/v1/', D = '1499272000000432293';
for (const p of ['automationFieldUpdates?module=tickets&departmentId=' + D, 'automationTasks?module=tickets&departmentId=' + D]) { const r = await api('GET', B + p); out['GET ' + p] = r.s + ' ' + r.t.slice(0, 300); }
// probe field update create (validation only first)
let r = await api('POST', B + 'automationFieldUpdates', {}); out.fuEmpty = r.s + ' ' + r.t.slice(0, 500);
r = await api('POST', B + 'automationFieldUpdates', { name: 'QA ZWF probe' }); out.fuName = r.s + ' ' + r.t.slice(0, 500);
// probe workflow with name only, then with a few fields (expect validation errors, not a create)
r = await api('POST', B + 'workflows', { name: 'QA ZWF probe' }); out.wfName = r.s + ' ' + r.t.slice(0, 600);
r = await api('POST', B + 'workflows', { name: 'QA ZWF probe', module: 'tickets', departmentId: D }); out.wfNameModDept = r.s + ' ' + r.t.slice(0, 600);
// sample criteria field shape
const cf = JSON.parse((await api('GET', B + 'workflows/criteriaFields?module=tickets&departmentId=' + D)).t); const f = cf.criteriaFields[0].fieldDetails; out.criteriaSample = JSON.stringify(f.filter(x => /subject|priority|isEscalated|isOverDue|ticketNumber|tags/i.test(x.fieldName || x.name || x.apiName || '')).map(x => ({ n: x.fieldName || x.name, label: x.displayLabel, conds: (x.availableConditions || []).map(c => c.condition).join('|') })));
require('fs').writeFileSync('zp4.json', JSON.stringify(out, null, 1));
