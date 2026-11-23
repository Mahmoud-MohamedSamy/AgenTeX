eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) {} } await sleep(12000);
const AG = '1499272000000432034', ME = '1499272000000139001';
const crit = JSON.stringify; const show = async id => { const j = JSON.parse((await api('GET', B + 'directAssignmentRules/' + id)).t); return { name: j.name, status: j.status, targets: (j.targets || []).map(t => ({ agent: t.agentId === AG ? 'test agent 2' : t.agentId === ME ? 'owner' : t.agentId, criteria: (t.criteria && t.criteria.fieldConditions || []).map(c => c.fieldName + ' ' + c.condition + ' ' + c.value).join(' AND ') || '(none)' })) }; };
const r = await api('POST', B + 'directAssignmentRules', { name: 'QA ZWF patch', description: 'QA', status: 'INACTIVE', executeOptions: ['CREATE'], targets: [{ criteria: { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: 'contains', value: ['qa zwf patch'] }], pattern: '1' }, fromDepartmentId: D, toDepartmentId: D, agentId: AG }] });
const id = JSON.parse(r.t).ruleId; require('fs').writeFileSync('zledger3.json', JSON.stringify({ rule: id })); out.created = await show(id);
// 1: PATCH rule with only name (no targets/criteria)
const p1 = await api('PATCH', B + 'directAssignmentRules/' + id, { name: 'QA ZWF patch renamed' }); out.p1 = p1.s; out.afterNameOnly = await show(id);
// 2: PATCH the target with only agentId (no criteria)
const tId = JSON.parse((await api('GET', B + 'directAssignmentRules/' + id)).t).targets[0].targetId;
const p2 = await api('PATCH', B + 'directAssignmentRules/' + id + '/targets/' + tId, { agentId: ME, toDepartmentId: D }); out.p2 = p2.s + ' ' + p2.t.slice(0, 160); out.afterTargetAgentOnly = await show(id);
// 3: PATCH target with criteria explicitly null
const p3 = await api('PATCH', B + 'directAssignmentRules/' + id + '/targets/' + tId, { criteria: null }); out.p3 = p3.s + ' ' + p3.t.slice(0, 200); out.afterCriteriaNull = await show(id);
// cleanup
out.del = (await api('DELETE', B + 'directAssignmentRules/' + id)).s; out.daLeft = JSON.parse((await api('GET', B + 'directAssignmentRules?departmentId=' + D)).t).data.map(x => x.name);
require('fs').writeFileSync('zt3.json', JSON.stringify(out, null, 1));
