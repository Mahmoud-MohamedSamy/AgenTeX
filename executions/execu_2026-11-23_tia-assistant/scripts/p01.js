const P = ['/agents/tia/status','/agents/tia/capabilities','/agents','/agents/014e511f-cbc5-5fd8-b939-f58a84beef15','/agents/tools','/agents/modules','/agents/custom-actions','/agents/tia-setup-areas','/agents/runtime-settings','/agents/runtime-settings/tia-strong-steps','/agents/runtime-status','/ai/policy','/ai/credits/wallet','/agents/tia/conversations'];
const out = {}; for (const p of P) { const r = await api('GET', p); out[p] = { s: r.s, body: r.j ?? r.t.slice(0,300) }; }
fs.writeFileSync(process.env.OUTF, JSON.stringify(out, null, 1));
const a = out['/agents/014e511f-cbc5-5fd8-b939-f58a84beef15'].body.data;
return { bad: Object.entries(out).filter(([k,v]) => v.s !== 200).map(([k,v]) => k+':'+v.s), ver: a.deployed_version_no, latest: a.latest_version_no, undeployed: a.has_undeployed_changes, tools: a.draft_definition.tool_keys.length, tia: out['/agents/runtime-status'].body.data.tia, wallet: out['/ai/credits/wallet'].body.data.available_credits };
