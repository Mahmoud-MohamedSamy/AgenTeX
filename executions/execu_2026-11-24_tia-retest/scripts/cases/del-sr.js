const all = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data); const del = all.filter(c => /^(How many deals are there\?|Create a lead with first name "QA TIA A11Y card")/.test(c.title || '') && String(c.updated_at) >= '2026-11-26T12');
const o = { n: del.length, s: {} }; for (const c of del) { const s = (await api('DELETE', `/agents/tia/conversations/${c.id}`)).s; o.s[s] = (o.s[s] || 0) + 1; }
o.qaLeads = (await api('GET', `/modules/${M.leads}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA TIA A11Y' }]))}`)).j?.meta?.total_count;
ledger('SR chats deleted ' + JSON.stringify(o)); return o;
