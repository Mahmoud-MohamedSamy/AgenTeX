// Wider benchmark: dates, "my" items, deal aggregates, one record summary. Ground truth from the API.
const all = async mod => { const out = []; for (let p = 1; p <= 20; p++) { const r = arr((await api('GET', `/modules/${mod}/records?page=${p}&per_page=100`)).j?.data); out.push(...r); if (r.length < 100) break; } return out; };
const fv = (rec, k) => { const f = arr(rec.data).find(x => x.field === k); const v = f?.value; return v == null ? null : (v.value ?? v.amount ?? v.number ?? v.values ?? v.label ?? null); };
const cnt = async (mod, f) => (await api('GET', `/modules/${mod}/records?page=1&per_page=1&filters=${encodeURIComponent(JSON.stringify(f))}`)).j?.meta?.total_count;
const me = (await api('GET', '/iam/users/me')).j?.data?.user_id; const TASKS = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const tasks = await all(TASKS); const deals = await all(DEALS);
const st = tasks.map(t => String(fv(t, 'status') || '')); const open = st.filter(s => s && !/complet|done|closed/i.test(s)).length;
const stages = {}; for (const d of deals) { const s = String(fv(d, 'stage') || fv(d, 'deal_stage') || ''); stages[s] = (stages[s] || 0) + 1; }
const amt = d => Number(fv(d, 'amount') || 0); const sum = deals.reduce((a, d) => a + amt(d), 0); const top = deals.slice().sort((a, b) => amt(b) - amt(a))[0];
const won = Object.entries(stages).filter(([k]) => /won/i.test(k)).reduce((a, [, v]) => a + v, 0);
const lead = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=50&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA AEO' }]))}`)).j?.data).find(l => fv(l, 'email'));
const truth = {
  createdToday: await cnt(M.leads, [{ field: 'created_at', operator: 'today' }]), createdThisWeek: await cnt(M.leads, [{ field: 'created_at', operator: 'this_week' }]),
  createdLastWeek: await cnt(M.leads, [{ field: 'created_at', operator: 'last_week' }]), createdThisMonth: await cnt(M.leads, [{ field: 'created_at', operator: 'this_month' }]), createdLastMonth: await cnt(M.leads, [{ field: 'created_at', operator: 'last_month' }]),
  myTasks: tasks.filter(t => fv(t, 'owner') === me).length, openTasks: open, statusValues: [...new Set(st)].slice(0, 8), dealsWon: won, stages, dealSum: sum, topDeal: top && { name: fv(top, 'deal_name') || fv(top, 'name'), amount: amt(top) },
  lead: lead && { first: fv(lead, 'first_name'), email: fv(lead, 'email'), company: fv(lead, 'company'), source: fv(lead, 'lead_source') },
};
const Q = [
  ['createdToday', 'How many leads were created today?'], ['createdThisWeek', 'How many leads were created this week?'], ['createdLastWeek', 'How many leads were created last week?'],
  ['createdThisMonth', 'How many leads were created this month?'], ['createdLastMonth', 'How many leads were created last month?'],
  ['myTasks', 'How many tasks do I own?'], ['openTasks', 'How many tasks are not completed yet?'], ['dealsWon', 'How many deals are closed won?'],
  ['dealSum', 'What is the total amount of all deals?'], ['topDeal', 'Which deal has the largest amount, and what is that amount?'],
  ['lead', truth.lead ? `Summarise the lead "${truth.lead.first}": give me its email, company and lead source.` : null],
];
const nums = t => (t.match(/\d[\d,]*(\.\d+)?/g) || []).map(x => Number(x.replace(/,/g, '')));
const o = { truth: { ...truth, lead: truth.lead && { first: truth.lead.first, hasEmail: !!truth.lead.email, company: truth.lead.company, source: truth.lead.source } }, rows: [] };
for (const [k, q] of Q.filter(x => x[1])) {
  const r = await ask(q, { page: { app: 'crm' } }); const t = r.text || r.final?.text || ''; const n = nums(t); let ok;
  if (k === 'topDeal') ok = !!truth.topDeal && n.includes(truth.topDeal.amount);
  else if (k === 'lead') ok = !!truth.lead && t.includes(String(truth.lead.email)) && (!truth.lead.company || t.includes(String(truth.lead.company)));
  else if (k === 'dealSum') ok = n.some(x => Math.abs(x - truth[k]) <= Math.max(1, truth[k] * 0.001));
  else ok = (truth[k] === 0 && /\bno\b|\bnone\b|\b0\b|zero/i.test(t)) || n[0] === truth[k];
  o.rows.push({ k, truth: k === 'lead' ? '(see truth)' : k === 'topDeal' ? truth.topDeal : truth[k], ok, text: t.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').slice(0, 170) });
  if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); await sleep(2500);
}
o.score = o.rows.filter(x => x.ok).length + '/' + o.rows.length; fs.appendFileSync(RUN + '/out/bm-results.jsonl', JSON.stringify({ kind: 'bm2', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
