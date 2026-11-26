// Count-accuracy benchmark: Tia's number vs API total_count. Runs per WHO/APP.
const total = async (mod, filters) => (await api('GET', `/modules/${mod}/records?page=1&per_page=1${filters ? '&filters=' + encodeURIComponent(JSON.stringify(filters)) : ''}`)).j?.meta?.total_count;
const mods = arr((await api('GET', `/modules?app_key=${process.env.APP}&limit=200`)).j?.data); const id = api_ => mods.find(m => m.apiName === api_)?.id;
const me = (await api('GET', '/iam/users/me')).j?.data?.user_id;
const Q = process.env.APP === 'desk' ? [
  ['tickets', 'How many tickets are there in Desk?', [id('tickets')]],
  ['desk contacts', 'How many contacts are there in Desk?', [id('contacts')]],
  ['tickets AR', 'كم عدد التذاكر في Desk؟', [id('tickets')]],
] : [
  ['leads', 'How many leads are there in CRM?', [M.leads]], ['contacts', 'How many contacts are there in CRM?', [id('contacts')]], ['deals', 'How many deals are there?', [id('deals')]],
  ['accounts', 'How many accounts are there?', [id('accounts')]], ['tasks', 'How many tasks are there?', [id('tasks')]], ['calls', 'How many calls are there?', [id('calls')]],
  ['meetings', 'How many meetings are there?', [id('meetings')]], ['campaigns', 'How many campaigns are there?', [id('campaigns')]],
  ['leads QA', 'How many leads have a first name starting with "QA"?', [M.leads, [{ field: 'first_name', operator: 'starts_with', value: 'QA' }]]],
  ['leads Name', 'How many leads have a first name starting with "Name"?', [M.leads, [{ field: 'first_name', operator: 'starts_with', value: 'Name' }]]],
  ['my tasks', 'How many tasks do I own?', [id('tasks'), [{ field: 'owner', operator: 'equals', value: me }]]],
  ['leads AR', 'كم عدد العملاء المحتملين (Leads) في CRM؟', [M.leads]],
  ['subscriptions', 'How many subscriptions are there?', [id('subscriptions')]],
];
const o = { who: process.env.WHO, app: process.env.APP, rows: [] };
for (const [k, q, [mod, f]] of Q) {
  const truth = mod ? await total(mod, f) : null; const r = await ask(q, { page: { app: process.env.APP } }); const t = r.text || r.final?.text || '';
  const nums = (t.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).match(/\d[\d,]*/g) || []).map(x => Number(x.replace(/,/g, '')));
  o.rows.push({ k, truth, tia: nums[0] ?? null, ok: truth != null && nums.includes(truth) && nums[0] === truth, text: t.slice(0, 150), err: r.error ? String(r.error).slice(0, 50) : null });
  if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); await sleep(2500);
}
o.score = o.rows.filter(x => x.ok).length + '/' + o.rows.length; fs.appendFileSync(RUN + '/out/bm-results.jsonl', JSON.stringify({ at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
