const RX = /^(How many deals are there\?|Explain step by step how to set up|Explain in detail how lead scoring|How many contacts are there in CRM\?|How many accounts are there\?|a{20,}|hi|كم عدد العملاء المحتملين|Create a lead with first name "QA TIA (VSR|A11Y) card"|How many leads are there in CRM\?)/;
const all = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data); const del = all.filter(c => RX.test(c.title || '') && String(c.updated_at) >= '2026-11-26T12');
const o = { n: del.length, s: {} }; for (const c of del) { const s = (await api('DELETE', `/agents/tia/conversations/${c.id}`)).s; o.s[s] = (o.s[s] || 0) + 1; }
o.qaLeads = (await api('GET', `/modules/${M.leads}/records?page=1&per_page=1&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA TIA VSR' }]))}`)).j?.meta?.total_count;
o.left = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data).filter(c => String(c.updated_at) >= '2026-11-26T12').map(c => c.title.slice(0, 40));
ledger('P4 UI chats deleted ' + JSON.stringify({ n: o.n, s: o.s })); return o;
