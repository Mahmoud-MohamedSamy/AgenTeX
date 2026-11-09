const A1 = '6b1158b3-36f1-40dd-a5ba-688ef8f4df88';
const fired = arr((await api('GET', `/desk/tickets/${A1}/comments`)).j?.data).filter(c => /A1 fired/.test(c.body_html)).length;
const rp = (await api('GET', `/desk/tickets/${A1}/replies`)).j?.data; const list = arr(rp?.replies || rp).map(r => (r.direction || r.kind || '') + ' ' + (r.from || r.author_name || '') + ' ' + r.created_at);
return fin({ fired, list });
