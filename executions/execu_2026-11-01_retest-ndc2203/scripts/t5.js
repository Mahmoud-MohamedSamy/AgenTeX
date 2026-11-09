// NDC-2203 A5 (user approved 1 Nov): Customer Happiness ON for a few minutes → rating email on QA tickets → public rating good / bad
// → Happiness Rating rules (all / good only / bad only) must fire as filtered. Settings restored in finally (is_enabled back to false).
const out = {}; const G = 'QA WF H5 ';
const S0 = (await api('GET', '/desk/happiness/settings')).j?.data; out.before = { is_enabled: S0?.is_enabled, trigger: S0?.trigger };
const keep = o => Object.fromEntries(Object.entries(o).filter(([k]) => !/_max$|_min$|option_icons|public_page_configured/.test(k)));
const ev = (events, x) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(x || {}) } });
const findToken = async id => { const blobs = [JSON.stringify(await getTicket(id)), JSON.stringify(arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data)), JSON.stringify(arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data)), (await api('GET', `/desk/tickets/${id}/emails`)).t, (await api('GET', `/desk/tickets/${id}/threads`)).t];
  for (const b of blobs) { const m = b.match(/happiness\/([A-Za-z0-9_\-.]{16,})/); if (m) return m[1]; } return null; };
try {
  const on = await api('PUT', '/desk/happiness/settings', { ...keep(S0), is_enabled: true }); out.enable = on.s + (on.s > 299 ? ' ' + on.t.slice(0, 200) : '');
  out.rules = {};
  for (const [name, ratings] of [['all', null], ['good', ['good']], ['bad', ['bad']]]) out.rules[name] = (await mkRule('H5' + name, ev(['rating'], ratings ? { ratings } : {}), [{ type: 'AddTicketComment', commentBody: `QA WF H5 ${name} fired`, commentPublic: false }], { criteria: guard(G) })).s;
  out.sendRule = (await mkRule('H5send', { kind: 'RecordCreated' }, [{ type: 'SendHappinessEmail' }], { criteria: guard(G) })).s;
  const tk = { good: (await mkTicket('H5 good')).id, bad: (await mkTicket('H5 bad')).id };
  await sleep(20000);
  out.send = {}; out.token = {};
  for (const [k, id] of Object.entries(tk)) { out.send[k] = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + String(d.responseBodyTruncated || d.errorMessage || '').slice(0, 140))); out.token[k] = await findToken(id); }
  out.rate = {};
  for (const [k, id] of Object.entries(tk)) { const tok = out.token[k]; if (!tok) { out.rate[k] = 'no token found'; continue; }
    const g = await api('GET', `http://x/`.replace('http://x/', '') + `/desk/public/happiness/${tok}`); out.rate[k + ' page'] = g.s;
    const p = await api('POST', `/desk/public/happiness/${tok}`, { rating: k, feedback: `QA WF H5 ${k} rating` }); out.rate[k] = p.s + ' ' + p.t.slice(0, 160); }
  await sleep(20000);
  out.fired = {}; for (const [k, id] of Object.entries(tk)) { const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data); const t = await getTicket(id);
    out.fired[k] = { rating: t.happiness_rating, comments: h.filter(a => a.action === 'comment.added').map(a => (a.summary?.body || a.summary?.by_rule_name || '')).join(' | ').slice(0, 300), rules: arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => (e.ruleName || e.ruleId?.slice(0, 8)) + ':' + e.outcome) }; }
  out.tickets = tk; for (const id of Object.values(tk)) out['n_' + id.slice(0, 4)] = (await getTicket(id)).ticket_number;
} finally {
  const cur = (await api('GET', '/desk/happiness/settings')).j?.data;
  const off = await api('PUT', '/desk/happiness/settings', { ...keep(S0), row_version: cur?.row_version, is_enabled: false }); out.restore = off.s + (off.s > 299 ? ' ' + off.t.slice(0, 200) : '');
  out.after = (await api('GET', '/desk/happiness/settings')).j?.data?.is_enabled;
}
return fin(out);
