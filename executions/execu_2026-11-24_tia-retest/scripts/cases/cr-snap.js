// Credits snapshot (read-only). Saves out/cr-snap-<TAG>.json
const P = ['/ai/credits/wallet', '/ai/credits/threshold', '/ai/feature-prices', '/ai/health/spend', '/ai/health', '/agents/analytics/usage', '/billing/usage', '/billing/me/summary', '/agents/tia/status?app=crm', '/agents/tia/capabilities'];
const o = {}; for (const p of P) { const r = await api('GET', p); o[p] = { s: r.s, d: r.j?.data ?? r.j ?? (r.t || '').slice(0, 300) }; }
const pol = (await api('GET', '/ai/policy')).j?.data; o.policy = { version: pol?.version, tia: pol?.descriptor?.features?.tia };
const a = await getAgent().catch(() => null); o.agentTia = a?.draft_definition?.tia; o.agentVer = a?.deployed_version_no; o.undeployed = a?.has_undeployed_changes;
fs.writeFileSync(RUN + `/out/cr-snap-${process.env.TAG || 'x'}-${process.env.WHO.replace(/\W/g, '_')}.json`, JSON.stringify(o, null, 1));
return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(JSON.stringify(v)).slice(0, 700)]));
