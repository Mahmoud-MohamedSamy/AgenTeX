// Check batch 1 results on each ticket.
const L = { B01a: 'b4f32e33-93a0-4f81-893e-8f4571017ab1', B01b: '289b476b-ceda-4b01-bb6f-9b99872b0f4d', B02: 'b7a7b3c6-f6e6-4abc-a4f9-3a2e7832689a', B05: '0bdb7b73-3512-464e-bf3e-1b327abbca34', B06: '66f245cb-c523-4180-987d-8bcffeaa3ca0', B07: 'b0ce7abf-fc20-45f1-843b-4bfd5f2955d0', B11: '5b9be064-dfc8-4584-8925-fb4a83946f05', B12: '0dc711d6-6227-4cff-8d7f-86bfabce3984', B13: '081b37e7-5a5c-4038-a32e-f8a3d4f23753', B14: '284b780c-e8d4-466d-a93b-b9061889e16d' };
const out = {};
for (const [tag, id] of Object.entries(L)) {
  const t = await getTicket(id); const o = { ex: await execs(id) };
  if (/B01/.test(tag)) o.comments = arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).map(c => (c.is_public ? 'PUBLIC ' : 'private ') + String(c.content_html || c.content || '').replace(/<[^>]+>/g, '').slice(0, 60) + ' by ' + (c.author_name || c.created_by_name || c.author?.name || c.created_by || '?'));
  if (tag === 'B02') { const rr = (await api('GET', `/desk/tickets/${id}/replies`)); o.replies = arr(rr.j?.data?.replies || rr.j?.data).map(x => ({ to: x.to, subj: x.subject, status: x.status, by: x.author_name || x.created_by_name })); }
  if (tag === 'B05') o.followers = t.followers;
  if (tag === 'B06') o.spam = t.is_spam;
  if (tag === 'B07') o.shared = t.shared_departments;
  if (/B1[1-4]/.test(tag)) { o.skills = t.skills; o.owner = t.owner; }
  out[tag] = o;
}
return fin(out);
