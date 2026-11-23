eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) { out['goto' + a] = 'timeout'; } } await sleep(12000);
out.daStatus = (await api('GET', B + 'directAssignmentRules/executionStatus')).t.slice(0, 200);
out.daRules = (await api('GET', B + 'directAssignmentRules?departmentId=' + D)).t.slice(0, 300);
const ag = await api('GET', B + 'agents?departmentIds=' + D + '&limit=50'); out.agents = JSON.parse(ag.t).data?.map(a => a.name + '=' + a.id + ' ' + a.status + ' ' + a.roleId) || ag.t.slice(0, 200);
const t = JSON.parse((await api('GET', B + 'tickets?limit=3&departmentId=' + D)).t).data || []; out.ticketFlags = t.map(x => ({ n: x.ticketNumber, isOverDue: x.isOverDue, isEscalated: x.isEscalated, sla: x.slaId ?? x.sla ?? null, keys: Object.keys(x).filter(k => /sla|escal|overdue/i.test(k)).join(',') }));
require('fs').writeFileSync('zp15.json', JSON.stringify(out, null, 1));
