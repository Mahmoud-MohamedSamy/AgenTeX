// Batch 4 (run 2): Customer Happiness — TE-07 rating events, CF-12 rating conditions, AC-23 Send happiness email on open/closed, AC-05 closing side effects, E2E-03.
// Happiness is switched ON scoped to QA AO Dept B only, and restored to the saved original at the end (diff checked).
const out = {}; const R = {}; const TK = {};
const ev = (events, extra) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(extra || {}) } });
const mark = v => FU({ qa_ndc_company_name: v });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions, o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
const orig = (await api('GET', '/desk/happiness/settings')).j?.data;
if (!orig) return { err: 'no settings' };
fs.writeFileSync(RUN + '/out/happiness-orig.json', JSON.stringify(orig, null, 1)); ledger('happiness settings saved to out/happiness-orig.json (restore at end)');
const strip = o => { const c = { ...o }; for (const k of ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured']) delete c[k]; return c; };
const on = await api('PUT', '/desk/happiness/settings', { ...strip(orig), is_enabled: true, department_scope_enabled: true, department_ids: [DEPT2] });
out.enable = on.s + ' ' + (on.s >= 300 ? on.t.slice(0, 300) : '');
try {
  const hk = await hook();
  // TE-07 rating rules
  await rule('TE07any', ev(['rating']), [WH(hk, '{"r":"any","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  await rule('TE07good', ev(['rating'], { ratings: ['good'] }), [WH(hk, '{"r":"good","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  await rule('TE07okay', ev(['rating'], { ratings: ['okay'] }), [WH(hk, '{"r":"okay","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  await rule('TE07bad', ev(['rating'], { ratings: ['bad'] }), [WH(hk, '{"r":"bad","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  await rule('TE07gb', ev(['rating'], { ratings: ['good', 'bad'] }), [WH(hk, '{"r":"good+bad","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  // CF-12 conditions on rating + link status (On Edit)
  await rule('CF12r', { kind: 'RecordUpdated' }, [mark('RATED-BAD')], { noGuard: true, criteria: AND(guard('QA WF TE07'), cmp('happiness_rating', 'Equal', S('bad'))) });
  await rule('CF12l', { kind: 'RecordUpdated' }, [mark('LINK')], { noGuard: true, criteria: AND(guard('QA WF TE07'), ex('happiness_link_status', 'IsNotNull')) });
  // AC-23 Send happiness email on open + closed
  await rule('AC23', { kind: 'RecordCreated' }, [{ type: 'SendHappinessEmail' }]);
  // E2E-03: closed → Bad rating → share to QA RT19 + task
  await rule('E2E03', ev(['rating'], { ratings: ['bad'] }), [{ type: 'ShareTicket', shareDepartmentId: DEPT, shareAccess: 'read_only' }, { type: 'Task', taskTitle: 'QA WF E2E03 call back ${subject}' }], { noGuard: true, criteria: guard('QA WF E2E03') });
  await sleep(2000);
  const rates = { g: 'good', o: 'okay', b: 'bad' };
  for (const k of Object.keys(rates)) await tk('TE07' + k, 'TE07', {}, rates[k]);
  await tk('AC23o', 'AC23', {}, 'open'); await tk('AC23c', 'AC23', { status: 'Closed' }, 'closed');
  await tk('E2E03', 'E2E03', { priority: 'high' });
  await sleep(8000);
  // close and rate through the public link (acts as the customer)
  const rateOne = async (id, rating) => {
    const cl = await patchTicket(id, { status: 'Closed' }); await sleep(4000);
    const ln = await api('POST', `/desk/tickets/${id}/happiness-link`, {}); const url = ln.j?.data?.url || ln.j?.data?.link || ''; const tokn = ln.j?.data?.token || (url.match(/happiness\/([^/?#]+)/) || [])[1];
    if (!tokn) return { close: cl.s, link: ln.s + ' ' + ln.t.slice(0, 200) };
    const base = 'https://staging-desk.taviportal.com/api/v1/desk/public/happiness/' + encodeURIComponent(tokn);
    const g = await fetch(base, { headers: { accept: 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'x-app-key': 'desk' } }); const gt = await g.text();
    const p = await fetch(base, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'x-app-key': 'desk' }, body: JSON.stringify({ rating, feedback: 'QA WF ' + rating, email: null }) }); const pt = await p.text();
    return { close: cl.s, link: ln.s, view: g.status + ' ' + gt.slice(0, 160), post: p.status + ' ' + pt.slice(0, 200) };
  };
  out.rate = {}; for (const k of Object.keys(rates)) out.rate[k] = await rateOne(TK['TE07' + k], rates[k]);
  out.rate.e2e = await rateOne(TK.E2E03, 'bad');
  await sleep(40000);
  const reqs = await hookReqs(hk); out.hooks = reqs.map(x => x.content);
  const v = {};
  for (const k of Object.keys(rates)) { const g = await getTicket(TK['TE07' + k]); v['TE07' + k] = { rating: g.happiness_rating, link: g.happiness_link_status, company: g.qa_ndc_company_name }; }
  v.AC23 = { open: await disp('AC23o', 'AC23'), closed: await disp('AC23c', 'AC23') };
  const mails = await api('GET', `/desk/tickets/${TK.AC23o}/threads`); v.AC23threads = mails.s + ' ' + JSON.stringify(arr(mails.j?.data).map(t => (t.subject || '') + ' ' + (t.status || t.delivery_status || '') + ' ' + (t.direction || ''))).slice(0, 400);
  { const g = await getTicket(TK.E2E03); v.E2E03 = { shared: g.shared_departments, run: await disp('E2E03', 'E2E03'), rating: g.happiness_rating }; }
  v.ratingsApi = (await api('GET', `/desk/tickets/${TK.TE07b}/happiness-ratings`)).t.slice(0, 300);
  out.v = v;
} finally {
  const cur = (await api('GET', '/desk/happiness/settings')).j?.data;
  const back = await api('PUT', '/desk/happiness/settings', { ...strip(orig), row_version: cur && cur.row_version });
  const now = (await api('GET', '/desk/happiness/settings')).j?.data; const diff = Object.keys(orig).filter(k => !['row_version', 'updated_at'].includes(k) && JSON.stringify(orig[k]) !== JSON.stringify(now && now[k]));
  out.restore = back.s + ' diff=' + JSON.stringify(diff); ledger('happiness restored ' + out.restore);
}
out.R = R; out.TK = TK;
fs.writeFileSync(RUN + '/out/b4.json', JSON.stringify(out, null, 1));
return out;
