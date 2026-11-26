// Group A — can a Tia card get around the app's rules. SUB=crmM|ownCrm|rst|ownDesk|snap
const SUB = process.env.SUB; const L = M.leads, T = M.tickets; const out = [];
const snapLead = async id => { const g = await getRec(L, id); return g.s === 200 ? { s: 200, title: val(g.rec, 'title'), company: val(g.rec, 'company'), last: val(g.rec, 'last_name'), src: val(g.rec, 'lead_source'), sl: val(g.rec, 'single_line') } : { s: g.s }; };
const snapTk = async id => { const g = await getRec(T, id); return g.s === 200 ? { s: 200, prio: val(g.rec, 'priority'), status: val(g.rec, 'status'), del: g.rec?.is_deleted } : { s: g.s }; };
if (SUB === 'snap') { const o = {}; for (const k of ['leadA', 'leadB', 'leadLock']) o[k] = await snapLead(P3I[k]); return o; }
if (SUB === 'snapDesk') { const o = {}; for (const k of ['t1', 't2', 't3', 't4', 'tOther']) o[k] = await snapTk(P3I[k]); return o; }
if (SUB === 'crmM') {
  // A-01 read-only field (Title read_only for CRM Manager)
  let x = await askCard('Set the Title of the lead "QA TIA P3 Lead B" to QA-P3-X.'); let c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  out.push(p3rec('A-01', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; text=${x.text.slice(0, 300)}`, { conv: x.conv }));
  // A-02 hidden field (single_line hidden for CRM Manager)
  x = await askCard('Set the Single Line field of the lead "QA TIA P3 Lead B" to QA-P3-Y.'); c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  const r2 = await ask('What is the value of the Single Line field on the lead "QA TIA P3 Lead B"?', { page: { app: 'crm' } });
  out.push(p3rec('A-02', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; text=${x.text.slice(0, 250)}; read-ask=${tiaText(r2).slice(0, 250)}`, { conv: x.conv }));
  return out.map(o => o.id);
}
if (SUB === 'ownCrm') {
  // A-04 locked record
  let x = await askCard('Change the company of the lead "QA TIA P3 Lock Lead" to QA P3 Lock Co 2.'); let c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  const ctl = await api('PATCH', `/modules/${L}/records/${P3I.leadLock}`, { data: [{ field: 'company', value: { kind: 'string', value: 'QA P3 Lock Co 3' } }] });
  out.push(p3rec('A-04', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; control PATCH by Owner=${ctl.s} ${(ctl.j?.error?.code || '')}; text=${x.text.slice(0, 250)}`, { conv: x.conv }));
  // A-06 validation rule (Title == QA-P3-BLOCK refused)
  x = await askCard('Set the Title of the lead "QA TIA P3 Lead A" to QA-P3-BLOCK.'); c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  out.push(p3rec('A-06', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; text=${x.text.slice(0, 250)}`, { conv: x.conv }));
  // A-07 required field cleared
  x = await askCard('Remove (clear) the last name of the lead "QA TIA P3 Lead A".'); c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  out.push(p3rec('A-07', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; text=${x.text.slice(0, 250)}`, { conv: x.conv }));
  // A-08 workflow fires on Tia create
  x = await askCard('Create a lead with first name QA TIA P3 WF, last name Lead, company QA P3 WF Co.'); c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  await sleep(25000);
  const wl = arr((await api('GET', `/modules/${L}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'equals', value: 'QA TIA P3 WF' }]))}`)).j?.data);
  const wfLead = wl[0]?.id; if (wfLead) { const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); I2.wfLead = wfLead; fs.writeFileSync(RUN + '/out/p3-ids.json', JSON.stringify(I2, null, 1)); ledger('P3: lead QA TIA P3 WF ' + wfLead + ' (created by Tia) — delete in R'); }
  const ex = await api('GET', `/workflow/rules/${P3I.wf}/executions`); const exs = arr(ex.j?.data);
  const tasks = arr((await api('GET', `/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'subject', operator: 'starts_with', value: 'QA TIA P3 task' }]))}`)).j?.data);
  out.push(p3rec('A-08', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; lead=${wfLead || 'none'}; rule executions=${ex.s}:${exs.length} ${JSON.stringify(exs[0] || '').slice(0, 200)}; tasks=${tasks.length}`, { conv: x.conv, tasks: tasks.map(t => t.id) }));
  // A-10 record history
  if (wfLead) { const tl = await api('GET', `/timeline/records/leads/${wfLead}/feed`); const fe = (tl.j?.data?.data || tl.j?.data || []); out.push(p3rec('A-10', '?', `timeline ${tl.s}: ${JSON.stringify(fe.slice(0, 4).map(e => ({ t: e.entry_type, by: e.actor_name || e.user_name || e.actor || e.created_by_name, src: e.source || e.via || e.channel, sum: (e.summary || e.title || '').slice(0, 80) })))}`)); }
  const tlA = await api('GET', `/timeline/records/leads/${P3I.leadA}/feed`); out.push(p3rec('A-10b', '?', `Lead A timeline ${tlA.s}: ${JSON.stringify((tlA.j?.data?.data || tlA.j?.data || []).slice(0, 5).map(e => ({ t: e.entry_type, by: e.actor_name || e.user_name || e.created_by_name, src: e.source || e.via, sum: (e.summary || e.title || '').slice(0, 80) })))}`));
  // A-11 audit log
  for (const p of [`/audit/logs?entity_id=${wfLead}`, `/audit/events?record_id=${wfLead}`, `/audit/logs?limit=10`, `/audit/entries?limit=10`]) { const a = await api('GET', p); if (a.s === 200) { out.push(p3rec('A-11', '?', `${p} → ${JSON.stringify(arr(a.j?.data).slice(0, 3)).slice(0, 600)}`)); break; } }
  // A-15 bulk change (rejected — capability only)
  x = await askCard('Set the lead source to Partner on all leads whose first name starts with "QA TIA P3".');
  const rj = []; for (const a of x.acts) rj.push(await rejectA(a));
  out.push(p3rec('A-15', '?', `cards=${x.acts.length}; ${x.card || 'none'}; lines=${JSON.stringify(x.lines || '').slice(0, 300)}; rejected=${rj}; text=${x.text.slice(0, 250)}`, { conv: x.conv }));
  return out.map(o => o.id);
}
if (SUB === 'rst') {
  let x = await askCard('Change the priority of the ticket "QA TIA P3 Other" to High.'); let c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  out.push(p3rec('A-03', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; text=${x.text.slice(0, 250)}`, { conv: x.conv }));
  x = await askCard('Create a ticket with subject "QA TIA P3 RST" in my department, priority Low.'); c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  await sleep(5000); const tl = arr((await api('GET', `/modules/${T}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'subject', operator: 'starts_with', value: 'QA TIA P3 RST' }]))}`)).j?.data);
  out.push(p3rec('A-13', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; RST can list it=${tl.length}; owner=${tl[0] ? val(tl[0], 'owner') : ''}; text=${x.text.slice(0, 200)}`, { conv: x.conv, ids: tl.map(t => t.id) }));
  x = await askCard('Delete the ticket "QA TIA P3 T2".'); c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  out.push(p3rec('A-14', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; text=${x.text.slice(0, 250)}`, { conv: x.conv }));
  return out.map(o => o.id);
}
if (SUB === 'ownDesk') {
  const x = await askCard('Create a ticket with subject "QA TIA P3 SLA" in the department of the ticket "QA TIA P3 T1", priority High.'); const c = x.acts[0] ? await confirmA(x.acts[0]) : null;
  await sleep(20000); const tl = arr((await api('GET', `/modules/${T}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'subject', operator: 'starts_with', value: 'QA TIA P3 SLA' }]))}`)).j?.data);
  const t = tl[0]; const ctl = t ? { owner: val(t, 'owner'), dept: val(t, 'department'), sla: JSON.stringify((t.data || []).filter(f => /sla|due|response/i.test(f.field)).map(f => f.field + '=' + JSON.stringify(f.value?.value))).slice(0, 300) } : null;
  out.push(p3rec('A-09', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; ticket=${JSON.stringify(ctl)}; text=${x.text.slice(0, 200)}`, { conv: x.conv, ids: tl.map(t => t.id) }));
  return out.map(o => o.id);
}
