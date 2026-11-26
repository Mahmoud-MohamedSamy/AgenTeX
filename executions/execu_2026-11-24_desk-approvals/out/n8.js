const t = async (who, q) => { const s = Date.now(); const r = await api[who]('GET', '/desk/approvals' + q); return [Date.now() - s, r.s]; };
const LT = [], C = []; for (let i = 0; i < 20; i++) { LT.push((await t('O', '?list=all_pending'))[0]); C.push((await t('B', '/count'.replace('/count', '') ? '' : ''))[0]); }
const C2 = []; for (let i = 0; i < 20; i++) { const s = Date.now(); await api.B('GET', '/desk/approvals/count'); C2.push(Date.now() - s); }
const p95 = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length * 0.95) - 1];
result('N8', 'INCONCLUSIVE', `list (All pending, ~45 items, not 10,000) p95 ${p95(LT)} ms over 20 calls from this PC; volume test not run`);
result('N9', 'INCONCLUSIVE', `count p95 ${p95(C2)} ms over 20 calls (small data); volume test not run`);
return { listP95: p95(LT), countP95: p95(C2) };
