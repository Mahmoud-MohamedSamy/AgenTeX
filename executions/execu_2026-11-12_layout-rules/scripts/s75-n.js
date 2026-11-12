const mid = await modId(); const out = { ok: 0 }; const t0 = Date.now();
if (process.env.DEL) { for (const r of (await rules(mid)).filter(x => x.name.startsWith(P + ' N2 '))) { const d = await delRule(mid, r.id); if (d.s < 300) out.ok++; } return out; }
for (let k = 0; k < 40; k++) { const r = await mkRule(mid, { name: P + ' N2 ' + k, layoutId: I.layout, primaryField: 'qa_lr_vip', status: 'disabled', branches: Array.from({ length: 5 }, (_, j) => br({ op: 'and', children: [eq('qa_lr_vip', true), { op: 'gt', field: 'qa_lr_amount', value: j }] }, [show(['qa_lr_date'])])) }); if (r.s === 201) out.ok++; }
out.ms = Date.now() - t0; const t1 = Date.now(); const l = await rules(mid); out.listApiMs = Date.now() - t1; out.n = l.length; return out;
