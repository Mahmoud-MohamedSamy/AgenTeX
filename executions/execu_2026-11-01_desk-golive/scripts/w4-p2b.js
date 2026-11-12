const P = '/desk/tickets/48326997-5fc4-49c4-8303-ce5c9429bad0';
const r = await api('GET', P + '/replies'); out.rs = r.s; out.replies = arr(D(r.j)).map(x => [x.mode, x.status || x.delivery_status, String(x.body_html).slice(0, 80)]);
const c = await api('GET', P + '/comments'); out.cs = c.s; out.comments = arr(D(c.j)).map(x => [x.is_public, String(x.body_html).slice(0, 80)]);
return fin({ out });
