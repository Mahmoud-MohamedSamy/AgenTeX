const all = ids(); const r = await api('GET', `/desk/tickets/${all.t1}/comments`);
return arr(r.j?.data).map(c => ({ id: c.id, public: c.is_public, body: (c.body_html || '').slice(0, 200), at: c.created_at }));
