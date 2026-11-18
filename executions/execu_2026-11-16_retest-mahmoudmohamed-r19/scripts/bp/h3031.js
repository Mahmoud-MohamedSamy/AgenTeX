const o = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3031.json', 'utf8')); const r = {};
for (const [k, id] of Object.entries(o.T)) { r[k] = { num: (await rec(id)).ticket_number, hist: (await histRaw(id)).map(h => (h.created_at || h.occurred_at || '').slice(11, 19) + ' ' + h.action + (h.field_key ? ':' + h.field_key : '') + (h.new_value ? '=' + String(typeof h.new_value === 'object' ? JSON.stringify(h.new_value) : h.new_value).slice(0, 60) : '') + (h.source ? ' src=' + JSON.stringify(h.source).slice(0, 120) : '') + (h.summary ? ' sum=' + JSON.stringify(h.summary).slice(0, 160) : '')).reverse() }; }
r.Akeys = Object.keys((await histRaw(o.T.A))[0] || {});
return r;
