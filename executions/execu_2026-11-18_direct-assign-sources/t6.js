const A = arr((await api('GET', '/desk/channels/addresses')).j?.data);
log(A.map(a => ({ id: a.id.slice(0, 8), address: /gmail/.test(a.address) ? '<gmail>' : a.address, dept: a.department_id?.slice(0, 8), active: a.is_active, receiving: a.mail?.receiving, verified: a.mail?.verified, kind: a.kind || a.type })));
const r = await api('GET', '/desk/channels'); log({ ch: r.s });
for (const p of ['/desk/channels/web-forms', '/desk/channels/forms', '/desk/channels/web_forms', '/desk/forms', '/desk/channels/widgets', '/desk/help-center/settings']) { const x = await api('GET', p); log(p + ' ' + x.s + ' ' + (x.s < 300 ? x.t.slice(0, 300) : '')); }
const L = arr((await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=100')).j);
log({ newestEmailTicket: 'see below' });
