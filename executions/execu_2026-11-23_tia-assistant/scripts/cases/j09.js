const id = '8763eff1-e817-561e-a092-0e403f742f26';
const c = await api('POST', `/agents/tia/actions/${id}/confirm`, {});
await sleep(3000);
const o = await api('GET', `/agents/tia/actions/${id}`);
const rules = arr((await api('GET', '/workflow/rules?take=200')).j?.data).filter(r => /Call the lead|QA TIA E07/i.test(r.name || ''));
for (const r of rules) ledger(`CRM workflow rule "${r.name}" ${r.id} (from J-09, active=${r.isActive})`);
const again = await api('POST', `/agents/tia/actions/${id}/confirm`, {});
return { confirm: c.s, cerr: c.j?.error, cdata: JSON.stringify(c.j?.data || '').slice(0, 300), outcome: JSON.stringify(o.j?.data || o.j?.error).slice(0, 300), rules: rules.map(r => ({ id: r.id, name: r.name, active: r.isActive, module: r.moduleId, createdBy: r.createdByName || r.createdBy })), again: again.s, againErr: again.j?.error };
