eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) {} } await sleep(12000);
const AG = '1499272000000432034'; const L = { rules: [], tickets: [], contacts: [] }; const save = () => require('fs').writeFileSync('zledger2.json', JSON.stringify(L, null, 1));
const r = await api('POST', B + 'directAssignmentRules', { name: 'QA ZWF edit only', description: 'QA', status: 'ACTIVE', executeOptions: ['EDIT'], targets: [{ criteria: { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: 'contains', value: ['qa zwf edit'] }], pattern: '1' }, fromDepartmentId: D, toDepartmentId: D, agentId: AG }] });
const j = JSON.parse(r.t); out.rule = r.s + ' ' + (j.ruleId || r.t.slice(0, 200)); if (j.ruleId) { L.rules.push(j.ruleId); save(); }
const ids = {}; for (const k of ['control', 'nochange', 'tag']) { const t = JSON.parse((await api('POST', B + 'tickets', { subject: 'qa zwf edit ' + k, departmentId: D, priority: 'Medium', contact: { lastName: 'QA ZWF', email: 'qa.zwf.test@example.com' } })).t); ids[k] = t.id; L.tickets.push(t.id); if (t.contactId && !L.contacts.includes(t.contactId)) L.contacts.push(t.contactId); save(); await sleep(1500); }
await sleep(15000);
const own = async k => { const t = JSON.parse((await api('GET', B + 'tickets/' + ids[k])).t); return t.assigneeId === AG ? 'assigned (rule ran)' : (t.assigneeId || 'unassigned'); };
out.afterCreate = { control: await own('control'), nochange: await own('nochange'), tag: await own('tag') };
out.p1 = (await api('PATCH', B + 'tickets/' + ids.control, { priority: 'High' })).s;
out.p2 = (await api('PATCH', B + 'tickets/' + ids.nochange, { priority: 'Medium' })).s;
const tg = await api('POST', B + 'tickets/' + ids.tag + '/associateTag', { tags: ['qazwftag'] }); out.p3 = tg.s + ' ' + tg.t.slice(0, 120);
await sleep(25000);
out.afterEdit = { control_realChange: await own('control'), nochange_samePriority: await own('nochange'), tag_only: await own('tag') };
const h = await api('GET', B + 'tickets/' + ids.nochange + '/History?limit=10'); out.nochangeHistory = h.s + ' ' + h.t.slice(0, 400);
require('fs').writeFileSync('zt2.json', JSON.stringify(out, null, 1));
