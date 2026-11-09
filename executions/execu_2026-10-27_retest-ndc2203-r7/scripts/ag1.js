const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const out = {};
const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.value;
for (const id of ['7644ce9e-0fe6-44da-99f1-79f58bfb0d45', '29049c30-eda1-46e8-a4b5-85ecbe4acc40']) { const g = await api('GET', `/modules/${T}/records/${id}`); const o = {}; for (const x of g.j?.data?.data || []) o[x.field] = val(x.value); out[id.slice(0, 8)] = g.s + ' owner=' + o.owner + ' team=' + o.team + ' subj=' + o.subject; }
const h = await api('GET', '/desk/tickets/7644ce9e-0fe6-44da-99f1-79f58bfb0d45/activity'); out.hist = h.s + ' ' + arr(h.j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').slice(0, 140)).join(' || ').slice(0, 1400);
const me = (await api('GET', '/iam/me')).j?.data; out.agent = me?.user_id;
return out;
