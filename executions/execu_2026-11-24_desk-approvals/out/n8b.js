const m = async (who, p) => { const a = []; for (let i = 0; i < 15; i++) { const s = Date.now(); await api[who]('GET', p); a.push(Date.now() - s); } a.sort((x, y) => x - y); return { p50: a[7], p95: a[13] }; };
const o = { settings: await m('O', '/desk/settings/approvals'), count: await m('B', '/desk/approvals/count'), list: await m('O', '/desk/approvals?list=all_pending'), deps: await m('O', '/desk/departments?limit=5') };
result('N8', 'INCONCLUSIVE', `small data only. list p50/p95 ${o.list.p50}/${o.list.p95} ms vs trivial settings GET ${o.settings.p50}/${o.settings.p95} ms from this PC (network included)`);
result('N9', 'INCONCLUSIVE', `count p50/p95 ${o.count.p50}/${o.count.p95} ms vs trivial GET ${o.settings.p50}/${o.settings.p95} ms`);
return o;
