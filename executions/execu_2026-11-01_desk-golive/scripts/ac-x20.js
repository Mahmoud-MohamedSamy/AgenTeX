const r = await api('GET', '/modules/' + TM + '/records?limit=100'); out.listN = arr(D(r.j)).length; out.meta = JSON.stringify(r.j && r.j.meta).slice(0, 200);
await go('/settings/data/export', 9000);
const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.getByRole('button', { name: /^Download$/ }).first().click().catch(() => page.getByText('Download', { exact: true }).first().click())]);
const p = RUN + '/access/raw/b-export.csv'; await dl.saveAs(p);
const csv = require('fs').readFileSync(p, 'utf8'); out.lines = csv.split('\n').length - 1; out.has = ['QA AC2 R1', 'QA AC2 R2', 'QA AC2 R3', 'QA AC2 R4', 'QA AC2 R5', 'QA AC2 R7'].map(s => s + ':' + csv.includes(s)).join(' ');
const depIdx = csv.split('\n')[0].split(',').findIndex(h => /department/i.test(h)); out.depHeader = csv.split('\n')[0].slice(0, 300);
out.depts = [...new Set(csv.split('\n').slice(1).map(l => (l.match(/(Marketing|Sales|HR|Customer Support|Tech|QA [A-Za-z0-9 ]+)/) || [''])[0]))].join(',');
return fin({ out });
