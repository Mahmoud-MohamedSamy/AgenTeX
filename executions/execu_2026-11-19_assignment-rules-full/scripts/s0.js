const r = {};
for (const D of [IDS.DA, IDS.DB]) { const d = (await api('GET', '/desk/departments/' + D)).j.data; const p = sh(await api('PATCH', '/desk/departments/' + D, { ...d, agent_user_ids: [...new Set([...d.agent_user_ids, IDS.A2])] })); const ok = ((await api('GET', '/desk/departments/' + D)).j.data.agent_user_ids || []).includes(IDS.A2); r[d.name] = { s: p.s, e: p.e, ok }; if (ok) LED('Dept ' + d.name + ': A2 added (restore: remove A2)'); }
return r;
