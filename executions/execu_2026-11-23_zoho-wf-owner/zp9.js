await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
const api = (m, p, b) => page.evaluate(async ([m, p, b]) => { const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined, credentials: 'include' }); return { s: r.status, t: await r.text() }; }, [m, p, b]);
const B = '/supportapi/zd/techegysolutions/api/v1/', D = '1499272000000432293'; out.steps = [];
const guess = { module: 'tickets', fieldName: 'classification', fieldValue: 'Problem', value: 'Problem', field: 'classification', fieldUpdateValue: 'Problem', description: 'QA' };
let body = { name: 'QA ZWF fu probe', departmentId: D };
for (let i = 0; i < 10; i++) { const r = await api('POST', B + 'automationFieldUpdates', body); out.steps.push(JSON.stringify(body).slice(0, 200) + ' => ' + r.s + ' ' + r.t.slice(0, 300)); let j = {}; try { j = JSON.parse(r.t); } catch {}
  if (r.s < 300) { out.created = r.t.slice(0, 600); if (j.id) out.deleted = (await api('DELETE', B + 'automationFieldUpdates/' + j.id)).s; break; }
  const miss = (j.errors || []).filter(e => e.errorType === 'missing').map(e => e.fieldName.replace(/^\//, '').split('/')[0]); let added = false; for (const m of miss) if (guess[m] !== undefined && body[m] === undefined) { body[m] = guess[m]; added = true; } if (!added) break; }
// workflow actions shape probe
const r2 = await api('POST', B + 'workflows', { name: 'QA ZWF probe', module: 'tickets', departmentId: D, status: 'INACTIVE', executeOn: { events: ['CREATE'] }, actions: {} }); out.wfActionsEmpty = r2.s + ' ' + r2.t.slice(0, 300);
const r3 = await api('POST', B + 'workflows', { name: 'QA ZWF probe', module: 'tickets', departmentId: D, status: 'INACTIVE', executeOn: { events: ['CREATE'] }, actions: { fieldUpdates: [] } }); out.wfActionsFU = r3.s + ' ' + r3.t.slice(0, 300);
const ex = ['EDIT', 'UPDATE', 'Edit']; out.edit = {}; for (const ev of ex) { const r = await api('POST', B + 'workflows', { name: 'QA ZWF probe', module: 'tickets', departmentId: D, status: 'INACTIVE', executeOn: { events: [ev] } }); out.edit[ev] = r.s + ' ' + r.t.slice(0, 160); }
require('fs').writeFileSync('zp9.json', JSON.stringify(out, null, 1));
