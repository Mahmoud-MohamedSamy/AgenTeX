const L = arr((await api('GET', '/agents?limit=100')).j?.data); const o = { n: L.length };
for (const a of L.slice(0, 40)) { const g = (await api('GET', `/agents/${a.id}`)).j?.data; const d = g?.draft_definition || {}; for (const k of ['max_turns', 'inactivity', 'wrap_up', 'faq_entries', 'data_sources', 'tag_allowlist', 'channels', 'answer_mode', 'read_module_keys']) if (d[k] != null && !o[k]) o[k] = JSON.stringify(d[k]).slice(0, 260); }
return o;
