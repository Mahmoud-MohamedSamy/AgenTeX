const T = arr((await api('GET', `/modules/${M.tickets}/records?page=1&per_page=10&filters=${encodeURIComponent(JSON.stringify([{ field: 'subject', operator: 'starts_with', value: 'QA TIA CRUD' }]))}`)).j?.data);
const W = arr((await api('GET', '/workflow/rules?limit=200')).j?.data).filter(r => /QA TIA CRUD/.test(r.name || ''));
const r7640 = arr((await api('GET', `/modules/${M.tickets}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'subject', operator: 'starts_with', value: 'QA BP R EW7OUTywo82' }]))}`)).j?.data);
return { tickets: T.length, rules: W.length, ticket7640Exists: r7640.length };
