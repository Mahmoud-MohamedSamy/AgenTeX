// J4 check as test user 1 (top of the chain): can it read the leads of its direct report (middle) and indirect report (bottom)?
const ids = { middle: '8fdcf5c9-e415-42b0-ad73-89bf50ee930c', bottom: '6890632f-f963-4413-a9d9-d7c24b152f25' };
const out = { me: (await call('GET', '/iam/me/profile')).j };
out.me = { user: out.me && (out.me.user_id || (out.me.data && out.me.data.user_id)) };
for (const [k, id] of Object.entries(ids)) { const r = await call('GET', `/modules/${MODS.leads}/records/${id}`); out[k] = r.s; }
const l = await call('GET', `/modules/${MODS.leads}/records?page=1&per_page=100&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288&sort_by=created_at&sort_dir=desc`);
const names = (l.j.data || []).map(x => ((x.data.find(f => f.field === 'first_name') || {}).value || {}).value).filter(n => /QA W1 J4/.test(n || ''));
out.listShows = names; out.listStatus = l.s;
return out;
