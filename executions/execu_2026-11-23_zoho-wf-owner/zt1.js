eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) {} } await sleep(12000);
const AG = '1499272000000432034'; const L = { rules: [], tickets: [], contacts: [] }; const save = () => require('fs').writeFileSync('zledger.json', JSON.stringify(L, null, 1));
const mkRule = async (name, cond, val) => { const r = await api('POST', B + 'directAssignmentRules', { name, description: 'QA', status: 'ACTIVE', executeOptions: ['CREATE'], targets: [{ criteria: { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: cond, value: [val] }], pattern: '1' }, fromDepartmentId: D, toDepartmentId: D, agentId: AG }] }); let j = {}; try { j = JSON.parse(r.t); } catch {} if (j.ruleId) { L.rules.push(j.ruleId); save(); } return r.s + ' ' + (j.ruleId || r.t.slice(0, 300)); };
out.r1 = await mkRule('QA ZWF contains', 'contains', 'qa zwf lower'); out.r2 = await mkRule('QA ZWF is', 'is', 'qa zwf eq exact');
await sleep(3000);
const subjects = { containsUpper: 'QA ZWF LOWER upper case', containsLower: 'qa zwf lower control', isUpper: 'QA ZWF EQ EXACT', isLower: 'qa zwf eq exact' }; const ids = {};
for (const [k, s] of Object.entries(subjects)) { const r = await api('POST', B + 'tickets', { subject: s, departmentId: D, priority: 'Medium', contact: { lastName: 'QA ZWF', email: 'qa.zwf.test@example.com' } }); let j = {}; try { j = JSON.parse(r.t); } catch {} if (j.id) { ids[k] = j.id; L.tickets.push(j.id); if (j.contactId && !L.contacts.includes(j.contactId)) L.contacts.push(j.contactId); save(); } else out['tk ' + k] = r.s + ' ' + r.t.slice(0, 300); await sleep(2000); }
await sleep(25000);
out.v = {}; for (const [k, id] of Object.entries(ids)) { const t = JSON.parse((await api('GET', B + 'tickets/' + id)).t); out.v[k] = { subject: t.subject, ticket: t.ticketNumber, assignee: t.assigneeId === AG ? 'test agent 2 (rule matched)' : (t.assigneeId || 'unassigned') }; }
require('fs').writeFileSync('zt1.json', JSON.stringify(out, null, 1));
