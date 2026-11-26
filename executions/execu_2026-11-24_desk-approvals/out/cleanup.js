// Cleanup in spec §1.5 order. Only QA PA records from this run; never the 2 protected Tech Webform items.
const o = {}; const bad = [];
const qa = x => /QA PA/.test(JSON.stringify(x));
// 1a. cancel every pending QA PA ticket approval (O can cancel any manual as admin? use requester first)
const allP = []; for (let p = 1; p <= 6; p++) { const r = await inbox('O', { list: 'all_pending', page: p, page_size: 100 }); const a = r.d?.approvals || []; allP.push(...a); if (a.length < 100) break; }
let canc = 0, rej = 0;
for (const it of allP.filter(x => x.kind === 'ticket_approval' && qa(x))) {
  const t = it.approval.ticket_id; const by = it.approval.requested_by === U.A ? 'A' : 'O';
  let r = await api[by]('POST', `/desk/tickets/${t}/approvals/${it.id}/cancel`, {});
  if (r.s >= 300) r = await api.O('POST', `/desk/tickets/${t}/approvals/${it.id}/reject`, { comment: 'QA PA cleanup', on_behalf_reason: 'QA PA cleanup' });
  if (r.s < 300) canc++; else bad.push('approval ' + it.id + ' ' + E(r));
}
// 1b. reject every pending QA PA web form submission
for (const it of allP.filter(x => x.kind === 'web_form_submission' && x.submission?.form_id === ST.FORM)) {
  if (ST.PROTECTED.includes(it.id)) continue;
  const r = await api.O('POST', `/web-forms/${ST.FORM}/pending/${it.id}/reject`, { reason: 'QA PA cleanup', notify_submitter: false, on_behalf_reason: 'QA PA cleanup' });
  if (r.s < 300) rej++; else bad.push('submission ' + it.id + ' ' + E(r));
}
o.cancelled = canc; o.rejected = rej;
// 2. workflow rule
if (ST.WFRULE) o.wfrule = (await api.O('DELETE', '/workflow/rules/' + ST.WFRULE)).s;
// 3. tickets (all QA PA tickets in D1/D2 + tracked ids)
const tids = new Set([...Object.values(ST.tickets || {}), ...Object.values(ST.SUBS || {}), ...Object.values(ST.L || {})].filter(Boolean));
for (const q of ['QA PA']) for (let p = 1; p <= 5; p++) { const r = await api.O('GET', `/modules/${T}/records?search=${encodeURIComponent(q)}&page_size=100&page=${p}`); const a = arr(r.j?.data); for (const x of a) if (/QA PA/.test(JSON.stringify(x.data || x))) tids.add(x.id); if (a.length < 100) break; }
let td = 0; for (const id of tids) { const r = await api.O('DELETE', `/modules/${T}/records/${id}`); if (r.s < 300 || r.s === 404) td++; else bad.push('ticket ' + id + ' ' + E(r)); }
o.tickets = td + '/' + tids.size;
// 4. blueprint
if (ST.BP) { const g = (await api.O('GET', `/modules/${T}/blueprints/${ST.BP}`)).j?.data; if (g) { const off = await api.O('PUT', `/modules/${T}/blueprints/${ST.BP}`, { definition: g.definition, isActive: false, revision: g.revision }); o.bpOff = off.s; } o.bpDel = (await api.O('DELETE', `/modules/${T}/blueprints/${ST.BP}`)).s; }
// 5. web form
if (ST.FORM) { const d = await api.O('POST', `/web-forms/${ST.FORM}/disable`); o.formDisable = d.s; o.formDel = (await api.O('DELETE', '/web-forms/' + ST.FORM)).s; }
// 6. team, departments
if (ST.TEAM) o.team = (await api.O('DELETE', '/desk/teams/' + ST.TEAM)).s;
await sleep(3000);
for (const k of ['D1', 'D2']) if (ST[k]) { const r = await api.O('DELETE', '/desk/departments/' + ST[k]); o['del' + k] = E(r); }
// 7. restore settings
const base = JSON.parse(fs.readFileSync(RUN + '/baseline.json', 'utf8')).settings;
o.settings = E(await api.O('PUT', '/desk/settings/approvals', base)); o.settingsNow = (await api.O('GET', '/desk/settings/approvals')).j?.data;
// 8. recycle bin purge of QA PA items
await sleep(8000); let pg = 0;
for (let k = 0; k < 10; k++) { const it = arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA PA/.test(JSON.stringify([i.record_label, i.name, i.title]))); if (!it.length) break; for (let j = 0; j < it.length; j += 50) { const d = await api.O('POST', '/audit/recycle-bin/delete', { ids: it.slice(j, j + 50).map(i => i.id) }); if (d.s < 300) pg += Math.min(50, it.length - j); } await sleep(3000); }
o.purged = pg;
// 9. verify
const left = {};
left.approvals = ((await inbox('O', { list: 'all_pending', q: 'QA PA', page_size: 100 })).d?.approvals || []).length;
left.depts = arr((await api.O('GET', '/desk/departments?limit=200')).j?.data?.departments || (await api.O('GET', '/desk/departments?limit=200')).j?.data).filter(d => /^QA PA/.test(d.name)).length;
left.forms = arr((await api.O('GET', '/web-forms?app_key=desk')).j?.data?.forms || (await api.O('GET', '/web-forms?app_key=desk')).j?.data).filter(f => /^QA PA/.test(f.name)).length;
left.bin = arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA PA/.test(JSON.stringify([i.record_label, i.name, i.title]))).length;
left.rules = arr((await api.O('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).filter(r => /^QA PA/.test(r.name)).length;
const tech = (await inbox('O', { list: 'all_pending', source: 'web_form', page_size: 100 })).d?.approvals || [];
left.protectedStillPending = ST.PROTECTED.map(id => tech.find(x => x.id === id)?.status || 'missing');
o.left = left; o.errors = bad.slice(0, 20);
ledger('CLEANUP ' + JSON.stringify(o).slice(0, 1500)); return o;
