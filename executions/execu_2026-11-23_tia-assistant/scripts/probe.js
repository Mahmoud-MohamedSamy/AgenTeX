const P = ['/agents/tia/status','/agents/tia/capabilities','/agents','/agents/tools','/agents/modules','/agents/custom-actions','/agents/tia-setup-areas','/agents/runtime-settings','/agents/runtime-settings/tia-strong-steps','/agents/runtime-status','/ai/policy','/ai/credits/wallet','/agents/tia/conversations','/settings/security/report-access','/agents/tia/stats','/agents/tia/feedback','/agents/tia/voice'];
const out = {};
for (const p of P) { const r = await api('GET', p); out[p] = { s: r.s, body: r.j ?? r.t.slice(0,300) }; }
fs.writeFileSync(process.env.OUTF, JSON.stringify(out, null, 1));
return Object.fromEntries(Object.entries(out).map(([k,v]) => [k, v.s]));
