page.on('dialog', d => d.accept().catch(() => {}));
const A1 = '6b1158b3-36f1-40dd-a5ba-688ef8f4df88';
const rp = (await api('GET', `/desk/tickets/${A1}/replies`)).j?.data; const dirs = arr(rp?.replies || rp).map(r => r.direction + ' ' + r.created_at.slice(11, 19));
const fired = arr((await api('GET', `/desk/tickets/${A1}/comments`)).j?.data).filter(c => /A1 fired/.test(c.body_html)).length;
const recent = arr((await api('GET', `/modules/${T}/records?page=1&per_page=5&sort_by=created_at&sort_dir=desc`)).j?.data).map(r => { const o = {}; for (const x of r.data || []) o[x.field] = val(x.value); return o.subject; });
return fin({ now: new Date().toISOString().slice(11, 19), dirs, fired, recent });
