const r = await call('GET', '/reporting/reports/392b1cea-f75a-4d44-bb3e-1d3ef42f63c0'); const d = await call('GET', '/reporting/dashboards/8eb349aa-544e-4330-8785-1645fb3a36ad');
const list = (await call('GET', '/reporting/dashboards')).t;
return { report: r.s + ' ' + r.t.slice(0, 160), dashboard: d.s + ' ' + d.t.slice(0, 160), dashInList: list.includes('8eb349aa') };
