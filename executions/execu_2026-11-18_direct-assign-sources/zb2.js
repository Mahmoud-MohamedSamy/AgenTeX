const D = '1499272000000006907';
const c = await api(page, 'POST', 'contacts', { lastName: 'QA RT22 BPMID', email: 'qa-rt22-bpmid@example.com' }); out.contact = c.j && c.j.id;
const mk = async (subject, status) => { const t = await api(page, 'POST', 'tickets', { subject, departmentId: D, contactId: out.contact, status, channel: 'Phone' }); return { s: t.s, id: t.j && t.j.id, n: t.j && t.j.ticketNumber, status: t.j && t.j.status, err: t.s >= 300 ? t.t.slice(0, 200) : undefined }; };
out.Z1 = await mk('QA RT22 BPMID Z1 created Open', 'Open');
out.Z2 = await mk('QA RT22 BPMID Z2 created Escalated', 'Escalated');
await page.waitForTimeout(15000);
for (const k of ['Z1', 'Z2']) { if (!out[k].id) continue; const g = await api(page, 'GET', 'tickets/' + out[k].id); const b = await api(page, 'GET', 'tickets/' + out[k].id + '/blueprint'); out[k].now = g.j && g.j.status; out[k].bp = b.s + ' ' + (b.j && b.j.currentState ? b.j.currentState.name + ':' + b.j.currentState.type : b.t.slice(0, 150)); }
require('fs').writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/zbp.json', JSON.stringify(out, null, 1));
