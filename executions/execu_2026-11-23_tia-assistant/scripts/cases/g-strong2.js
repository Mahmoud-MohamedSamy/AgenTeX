const tries = [];
const put = async (u, w) => { const v = (await api('GET', '/agents/runtime-settings')).j?.data?.version; const r = await api('PUT', '/agents/runtime-settings/tia-strong-steps', { tia_strong_steps_per_user_daily: u, tia_strong_steps_per_workspace_daily: w, expected_version: v }); const a = (await api('GET', '/agents/runtime-settings')).j?.data; tries.push(`${u}/${w} @v${v} → ${r.s} ${r.j?.error?.code || ''} | now ${a.tia_strong_steps_per_user_daily}/${a.tia_strong_steps_per_workspace_daily} v${a.version}`); };
await put(11, 100); await put(-1, 100); await put(10, 101); await put(0, 0); await put(10, 100);
return tries;
