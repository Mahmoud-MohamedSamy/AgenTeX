await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
const api = (m, p, b) => page.evaluate(async ([m, p, b]) => { const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined, credentials: 'include' }); return { s: r.status, t: await r.text() }; }, [m, p, b]);
const B = '/supportapi/zd/techegysolutions/api/v1/', D = '1499272000000432293';
const cf = JSON.parse((await api('GET', B + 'workflows/criteriaFields?module=tickets&departmentId=' + D)).t); const fd = cf.criteriaFields[0].fieldDetails; out.fieldKeys = Object.keys(fd[0]).join(','); out.someFields = fd.slice(0, 80).map(x => x.fieldLabel + ':' + x.type).join(', ');
out.subjectEntry = String(JSON.stringify(fd.find(x => x.fieldLabel === 'Subject'))).slice(0, 500);
// iterate workflow schema (guesses); stop on non-missing error or success (then delete immediately)
const guess = { status: 'ACTIVE', executeOn: ['create'], criteria: { fieldConditions: [{ fieldName: 'subject', fieldModule: 'tickets', condition: 'contains', value: ['qa zwf probe'] }], pattern: '1' }, actions: { alerts: [] }, ruleType: 'WORKFLOW', module: 'tickets', description: 'QA' };
let body = { name: 'QA ZWF probe', module: 'tickets', departmentId: D }; out.steps = [];
for (let i = 0; i < 12; i++) { const r = await api('POST', B + 'workflows', body); let j = {}; try { j = JSON.parse(r.t); } catch {} out.steps.push(r.s + ' ' + r.t.slice(0, 260));
  if (r.s < 300) { out.created = r.t.slice(0, 800); if (j.id) out.deleted = (await api('DELETE', B + 'workflows/' + j.id)).s; break; }
  const miss = (j.errors || []).filter(e => e.errorType === 'missing').map(e => e.fieldName.replace(/^\//, '').split('/')[0]); if (!miss.length) break; let added = false; for (const m of miss) if (guess[m] !== undefined && body[m] === undefined) { body[m] = guess[m]; added = true; } if (!added) break; }
out.lastBody = JSON.stringify(body).slice(0, 500);
require('fs').writeFileSync('zp5.json', JSON.stringify(out, null, 1));
