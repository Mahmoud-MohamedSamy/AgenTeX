const out = {};
for (const p of ['/agents/tia/status','/agents/tia/capabilities','/agents/runtime-status','/ai/policy']) { const r = await api('GET', p); out[p] = { s: r.s, body: r.j ?? r.t.slice(0,300) }; }
fs.writeFileSync('../out/probe-crm-owner.json', JSON.stringify(out, null, 1));
return { status: out['/agents/tia/status'], caps_tools: (out['/agents/tia/capabilities'].body?.data?.tools||[]).length, caps_apps: out['/agents/tia/capabilities'].body?.data?.apps, tia: out['/agents/runtime-status'].body?.data?.tia };
