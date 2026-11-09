// A5 result: #736 rated Bad, #737 rated Good (user, 1 Nov); then Customer Happiness OFF again.
const out = {}; const tk = { '#736 (Bad)': '429ccfc6-180f-4fb3-93d0-82cf8fce0683', '#737 (Good)': '2876285e-21dd-4a1f-8e9c-8d52b1239478' };
const rules = Object.fromEntries(arr((await api('GET', '/workflow/rules?take=200')).j?.data).filter(r => /^QA WF H5(all|good|bad)$/.test(r.name)).map(r => [r.id, r.name]));
for (const [k, id] of Object.entries(tk)) { const t = await getTicket(id); const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data);
  const ex = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data);
  out[k] = { rating: t.happiness_rating, status: t.status, customerResponded: t.customer_responded,
    ratingRulesFired: ex.filter(e => rules[e.ruleId]).map(e => rules[e.ruleId] + ':' + e.outcome),
    comments: h.filter(a => a.action === 'comment.added').map(a => String(a.summary?.body || a.summary?.content || a.summary?.by_rule_name || '')).slice(0, 5),
    history: h.map(a => a.action).filter(a => /rating|happiness|reply|reopen|status/i.test(a)).slice(0, 8) }; }
const S = (await api('GET', '/desk/happiness/settings')).j?.data; const keep = o => Object.fromEntries(Object.entries(o).filter(([k]) => !/_max$|_min$|option_icons|public_page_configured/.test(k)));
out.off = (await api('PUT', '/desk/happiness/settings', { ...keep(S), is_enabled: false })).s; out.nowEnabled = (await api('GET', '/desk/happiness/settings')).j?.data?.is_enabled;
return out;
