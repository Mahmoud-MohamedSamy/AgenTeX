for (const id of ['33410d1e-3399-431b-9f25-26b880ac5312', '737209e6-2bbc-4240-bbf8-ce814802e618', '50437141-7b37-4be1-b688-075c6c4c7a91']) {
  const r = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + id);
  if (!r.j || !r.j.data) { log({ id, s: r.s, t: r.t.slice(0, 200) }); continue; } const f = {}; for (const x of (r.j.data.data || [])) f[x.field] = x.value && (x.value.value !== undefined ? x.value.value : x.value);
  log({ id: id.slice(0, 8), subject: f.subject, owner: f.owner_id || f.owner || f.ticket_owner, number: f.ticket_number || f.number, keys: Object.keys(f).filter(k => /own|assign/i.test(k)) });
}
