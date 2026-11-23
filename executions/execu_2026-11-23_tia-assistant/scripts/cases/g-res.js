const r = await setPol(d => { d.features.tia = { enabled: true, daily_credit_cap: 100000000 }; });
const p = await getPol(); ledger(`AI policy tia restored to {enabled:true,daily_credit_cap:1e8} → ${r.s} v${p.version}`);
return { put: r.s, tia: p.descriptor.features.tia, v: p.version };
