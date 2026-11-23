eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) {} } await sleep(12000);
out.testRule = (await api('GET', B + 'directAssignmentRules/1499272000000544003')).t.slice(0, 1500);
const one = JSON.parse((await api('GET', B + 'tickets?limit=1&departmentId=' + D)).t).data[0];
const full = JSON.parse((await api('GET', B + 'tickets/' + one.id)).t); out.flagKeys = Object.keys(full).filter(k => /sla|escal|overdue|isResponse/i.test(k)).map(k => k + '=' + JSON.stringify(full[k])).join(', ');
require('fs').writeFileSync('zp16.json', JSON.stringify(out, null, 1));
