const all = ids(); const out = {};
out.tasks = []; for (const t of all.j18tasks || []) out.tasks.push((await api('DELETE', `/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/records/${t}`)).s);
out.lead = (await api('DELETE', `/modules/${M.leads}/records/${all.j18lead}`)).s;
out.rule = (await api('DELETE', `/workflow/rules/${all.j18rule}`)).s;
out.ruleLeft = arr((await api('GET', `/workflow/rules?take=200&moduleId=${M.leads}`)).j?.data).filter(r => /QA TIA/.test(r.name || '')).length;
out.leadsLeft = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA TIA' }]))}`)).j?.data).length;
ledger(`J-18 cleanup: tasks ${JSON.stringify(out.tasks)}, lead ${out.lead}, rule ${out.rule}; QA TIA rules left ${out.ruleLeft}, QA TIA leads left ${out.leadsLeft}`);
return out;
