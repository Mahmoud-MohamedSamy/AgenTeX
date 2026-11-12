const o = {}; const ids = { b3105: 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9', e3106: '9804a4f1-b4d3-4b76-8638-3837001ceedc', s3107: 'a958ebfc-4a5f-489b-9019-a25db0610df0', c3108: '30bb8716-cd9a-4e0b-8d49-8a2aa67db1d6', m3119: 'f2fa192d-843d-4deb-b967-7383e71e882f', u3120: 'e4c207d8-cda7-43a1-946d-4d2626759b7e' };
for (const [k, id] of Object.entries(ids)) { const r = await api('GET', `/desk/tickets/${id}/replies`); o[k] = arr(r.j && r.j.data).filter(m => m.direction !== 'outbound').map(m => [m.id, m.direction, m.subject, m.created_at, (m.body_text || '').slice(0, 120)]); }
const d = await api('GET', '/desk/departments/7e1ac409-' ); o.dep = d.s;
const ds = await api('GET', '/desk/departments'); o.cs = arr(ds.j && ds.j.data).filter(x => /Customer Support|Marketing/.test(x.name)).map(x => [x.id, x.name, JSON.stringify(x.email_addresses || x.emails || x.mailboxes || '').slice(0, 200), JSON.stringify(x.signature || x.signature_html || '').slice(0, 200)]);
return done(o);
