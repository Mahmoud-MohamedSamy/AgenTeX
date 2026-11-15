const MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794', CON = 'de7195a2-369e-48c5-b03f-b8e37d6c5fb2', EM = 'mmohamed@anyware.software';
const sv = v => ({ kind: 'string', value: v });
const deps = arr(D((await api('GET', '/desk/departments?limit=50')).j)); out.deps = deps.map(d => d.id + ' ' + d.name);
const CS = (deps.find(d => /customer support/i.test(d.name)) || {}).id; out.CS = CS;
const cur = D((await api('GET', '/desk/happiness/settings')).j);
const p = await api('PUT', '/desk/happiness/settings', { ...cur, is_enabled: true, department_scope_enabled: true, department_ids: [MK] }, { 'if-match': String(cur.row_version) }); out.on = p.s + ' ' + p.t.slice(0, 150);
const now = D((await api('GET', '/desk/happiness/settings')).j); out.now = { on: now.is_enabled, scope: now.department_scope_enabled, deps: now.department_ids };
out.t = {};
for (const [k, dep] of [['mk', MK], ['cs', CS]]) {
  const subj = 'QA GL W4R rating ' + (k === 'mk' ? 'Marketing' : 'Customer Support');
  const c = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv(subj) }, { field: 'description', value: sv(subj + ' (W4-72/73 retest)') }, { field: 'department', value: sv(dep) }, { field: 'contact_id', value: sv(CON) }, { field: 'email', value: sv(EM) }, { field: 'status', value: sv('Open') }] });
  const rec = flat(D(c.j) || {}); const id = rec.id || (D(c.j) && D(c.j).id); const o = out.t[k] = { create: c.s, id, n: rec.ticket_number };
  if (!id) { o.err = c.t; continue; }
  CREATED.push({ kind: 'ticket', id, label: subj });
  const r = await api('POST', '/desk/tickets/' + id + '/replies', { mode: 'reply', to: [EM], cc: [], bcc: [], subject: 'Re: ' + subj, body_html: '<p>' + subj + ': agent reply before closing. The closing mail follows.</p>' }); o.reply = r.s;
  await sleep(4000);
  const cl = await api('POST', '/desk/tickets/' + id + '/close', {}); o.close = cl.s; o.closedAt = new Date().toISOString();
}
await sleep(20000);
for (const k of Object.keys(out.t)) { const id = out.t[k].id; if (!id) continue;
  const rp = await api('GET', '/desk/tickets/' + id + '/replies'); out.t[k].replies = arr(D(rp.j)).map(x => ({ mode: x.mode, st: x.status || x.delivery_status, subj: x.subject, link: (String(x.body_html || '').match(/https?:\/\/[^"'<\s]*(happiness|rate|rating|feedback)[^"'<\s]*/i) || [])[0] ? 'HAS_LINK' : '', body: String(x.body_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 200) }));
  const n = flat(D((await api('GET', '/modules/' + TM + '/records/' + id)).j) || {}); out.t[k].n = n.ticket_number || n.number; out.t[k].status = n.status; }
return fin({ out });
