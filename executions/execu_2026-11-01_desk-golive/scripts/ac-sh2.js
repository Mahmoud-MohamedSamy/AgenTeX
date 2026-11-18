await sleep(35000); // NDC-2376 used to need ~30 s
const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 70) : ''); };
out.list = (await listQA()).ids.join(','); out.r = {};
for (const k of ['SH1', 'SH2', 'MK2']) { const id = TK[k], P = '/desk/tickets/' + id, R = '/modules/' + TM + '/records/' + id; const o = {};
  o.view = (await api('GET', R)).s; o.comments = (await api('GET', P + '/comments')).s; o.history = (await api('GET', P + '/history')).s;
  const g = D((await api('GET', R)).j) || {}; const rv = g.row_version;
  o.editPriority = await pr('PATCH', R, { data: [{ field: 'priority', value: sv('low') }], row_version: rv });
  o.editStatus = await pr('PATCH', R, { data: [{ field: 'status', value: sv('On Hold') }] });
  o.assignC = await pr('POST', P + '/assign', { owner_id: US.C });
  o.privComment = await pr('POST', P + '/comments', { body_html: '<p>QA AC C private comment ' + k + '</p>', is_private: true });
  o.reply = await pr('POST', P + '/replies', { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA AC ' + k, body_html: '<p>QA AC shared-ticket reply test ' + k + ' (please ignore)</p>' });
  o.reshareHR = await pr('PUT', P + '/shares', { shares: [{ department_id: DEP.CS, access: 'full' }, { department_id: DEP.HR, access: 'read_only' }] });
  o.unshare = await pr('PUT', P + '/shares', { shares: [] });
  o.after = (await api('GET', P + '/shares')).t.match(/"access":"[a-z_]+"/g)?.join(',') || 'none';
  const g2 = flat(D((await api('GET', R)).j) || {}); o.now = [g2.priority, g2.status, (g2.owner || '').slice?.(0, 8)].join('/');
  out.r[k] = o; }
return fin({ out });
