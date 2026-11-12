const TK = 'f2fa192d-843d-4deb-b967-7383e71e882f'; const rl = await api('GET', `/desk/tickets/${TK}/replies`);
const r = arr(rl.j.data)[0]; const o = { keys: Object.keys(r), body: r.body_html, delivery: r.delivery_status || r.status, from: r.from_address };
const e = await api('GET', '/desk/tickets/9804a4f1-b4d3-4b76-8638-3837001ceedc/replies'); o.earlier = arr(e.j && e.j.data).map(x => [x.created_at, x.status, /signature line/.test(x.body_html || ''), (x.body_html || '').slice(-200)]);
return done(o);
