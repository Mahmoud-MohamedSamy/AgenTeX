for (const id of ['33410d1e-3399-431b-9f25-26b880ac5312', '737209e6-2bbc-4240-bbf8-ce814802e618', '50437141-7b37-4be1-b688-075c6c4c7a91']) {
  const r = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + id); const j = r.j && (r.j.data || r.j);
  const flat = JSON.stringify(j); const pick = k => { const m = flat.match(new RegExp('"' + k + '":("[^"]*"|null|[0-9]+)')); return m && m[1]; };
  log({ id: id.slice(0, 8), s: r.s, subject: pick('subject'), owner: pick('owner_id') || pick('ownerId') || pick('owner'), number: pick('ticket_number') || pick('number'), created_by: pick('created_by'), keys: Object.keys(j || {}).slice(0, 30) });
}
const me = await api('GET', '/iam/me'); log({ me: me.s, id: me.j && (me.j.id || (me.j.user && me.j.user.id)) });
