const r = await call('DELETE', '/reporting/reports/392b1cea-f75a-4d44-bb3e-1d3ef42f63c0'); const d = await call('DELETE', '/reporting/dashboards/8eb349aa-544e-4330-8785-1645fb3a36ad');
return { report: r.s + ' ' + r.t.slice(0, 300), dashboard: d.s + ' ' + d.t.slice(0, 300) };
