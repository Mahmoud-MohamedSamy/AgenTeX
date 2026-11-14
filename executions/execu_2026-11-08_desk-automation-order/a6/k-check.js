// After the user's Gmail/portal actions: state, status, inbound replies, ratings and history per K ticket. Writes k-check-out.json.
const n = require('./bp/ndc'); const { call } = n; const fs = require('fs'); const M = require('./k-made.json');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const val = x => !x ? undefined : x.kind === 'array' ? (x.items || []).map(val) : x.value;
const mask = s => String(s).replace(/mahmoud\.mmohamedsamy/g, 'G');
(async () => {
  const out = {};
  for (const [k, t] of Object.entries(M.tickets)) {
    const f = Object.fromEntries(((await call('owner', 'GET', `/modules/${TK}/records/${t.id}`)).json?.data?.data || []).map(x => [x.field, val(x.value)]));
    const s = ((await call('owner', 'GET', `/modules/${TK}/records/${t.id}/blueprint-state`)).json?.data?.states || [])[0];
    const rp = ((await call('owner', 'GET', `/desk/tickets/${t.id}/replies`)).json?.data || []).map(r => `${r.direction} ${r.mode} ${r.created_at?.slice(11, 19)} ${String(r.body_text || r.body_html || '').replace(/<[^>]+>/g, ' ').slice(0, 60)}`);
    const hp = await call('owner', 'GET', `/desk/tickets/${t.id}/happiness`); const rt = await call('owner', 'GET', `/desk/happiness/ratings?ticket_id=${t.id}`);
    const h = ((await call('owner', 'GET', `/desk/tickets/${t.id}/history`)).json?.data || []).map(x => `${x.occurred_at?.slice(11, 19)} ${x.action}${x.field_key ? ':' + x.field_key : ''}${x.new_value ? '=' + JSON.stringify(x.new_value).slice(0, 40) : ''} [${x.actor?.kind}/${x.source}]`).reverse();
    out[k] = { num: t.num, status: f.status, state: s?.activeStates || null, replies: rp, happiness: hp.status + ' ' + JSON.stringify(hp.json?.data ?? '').slice(0, 300), ratings: (Array.isArray(rt.json?.data) ? rt.json.data : (rt.json?.data?.items || [])).filter(r => r.ticket_id === t.id).map(r => r.rating + ' ' + r.submitted_at), history: h };
  }
  fs.writeFileSync(__dirname + '/k-check-out.json', mask(JSON.stringify(out, null, 1))); console.log(mask(JSON.stringify(out, null, 1)));
})();
