const out = {}; const tk = { good: '429ccfc6-180f-4fb3-93d0-82cf8fce0683', bad: '2876285e-21dd-4a1f-8e9c-8d52b1239478' };
for (const [k, id] of Object.entries(tk)) for (const p of ['replies', 'history', 'activity']) { const r = await api('GET', `/desk/tickets/${id}/${p}`); const m = r.t.match(/happiness\/([A-Za-z0-9_\-.%]{12,})/);
  out[k + ' ' + p] = r.s + ' len ' + r.t.length + ' token ' + (m ? 'found' : 'no') + ' kinds ' + [...new Set((r.t.match(/"(?:kind|type|action|channel)":"[^"]+"/g) || []))].slice(0, 8).join(','); if (m) out['tok_' + k] = m[1].length; }
const rp = await api('GET', `/desk/tickets/${tk.good}/replies`); const first = arr(rp.j?.data)[0]; out.replyKeys = first ? Object.keys(first) : null;
out.replySample = first ? JSON.stringify(first).replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 600) : null;
return out;
