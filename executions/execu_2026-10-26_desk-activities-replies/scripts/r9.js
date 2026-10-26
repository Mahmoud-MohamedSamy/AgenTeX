const tk = '60e81b1b-e8ae-4a5d-aad9-70b69d9624b9';
const c = await api('GET', `/desk/tickets/${tk}/comments`); const t = await api('GET', `/desk/tickets/${tk}`);
return JSON.stringify({ comments: (c.j.data || []).map(x => ({ b: (x.body_html || '').slice(0, 60), pub: x.is_public })), status: t.j.data.status, counts: t.j.data.counts });
