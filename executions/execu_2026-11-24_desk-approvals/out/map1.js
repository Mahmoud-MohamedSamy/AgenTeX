const o = {};
for (const p of ['/desk/approvals', '/desk/approvals?tab=waiting', '/desk/approvals/counts', '/approvals', '/desk/approvals?view=all', '/desk/approvals/summary']) { const r = await api('GET', p); o[p] = r.s + ' ' + r.t.slice(0, 1500); }
return o;
