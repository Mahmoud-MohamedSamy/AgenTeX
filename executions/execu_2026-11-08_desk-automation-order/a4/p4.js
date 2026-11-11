// A4 Group P batch 4: P17 team on Create and Edit, P21 Change Layout (to the all-departments "QA NDC ADM" layout; layout itself untouched), P22 Run Custom Action (QA echo action), P26 saved action of a new type.
const R = {};
// P17: QA team in Dept A with Samy
const tm = await api('POST', '/desk/teams', { name: 'QA AO WF Team', description: 'A4 P17, delete after', department_id: D });
const TM = tm.j?.data?.id; if (TM) track('team', TM, 'P17');
R.team = [tm.s, TM ? (await api('PUT', '/desk/teams/' + TM, { name: 'QA AO WF Team', description: 'A4 P17, delete after', department_id: D, sources: [{ kind: 'agent', ref_id: SAMY }] })).s : tm.t.slice(0, 200)];
const own = [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: TM }];
R.P17c = { rule: await mkRule('P17c', { kind: 'RecordCreated' }, own) };
R.P17e = { rule: await mkRule('P17e', { kind: 'RecordUpdated' }, own) };
R.P21 = { rule: await mkRule('P21', { kind: 'RecordCreated' }, [{ type: 'ChangeTicketLayout', ticketLayoutId: 'd1e6505d' }]) };
const lay = arr2((await api('GET', '/modules/' + T + '/layouts')).j?.data).find(x => x.name === 'QA NDC ADM');
if (lay) { await api('DELETE', '/workflow/rules/' + R.P21.rule.id); R.P21 = { rule: await mkRule('P21b', { kind: 'RecordCreated' }, [{ type: 'ChangeTicketLayout', ticketLayoutId: lay.id }]) }; }
// P22 custom action
const ca = await api('POST', '/workflow/custom-actions', { sourceId: 'aca6d31d-5631-4421-88c4-c28c6414c49c', name: 'QA AO WF P22 echo', description: 'A4 P22, delete after', method: 'GET', path: '/anything/qa-ao-wf-p22', targetApps: ['desk'], status: 'active', inputBindings: [], dependencies: [], errorMappings: [], outputMappings: [] });
const CA = ca.j?.data?.id; if (CA) track('customAction', CA, 'P22'); R.ca = [ca.s, CA ? null : ca.t.slice(0, 220)];
if (CA) { const p = await api('POST', `/workflow/custom-actions/${CA}/publish`, {}); R.caPublish = p.s; R.P22 = { rule: await mkRule('P22', { kind: 'RecordCreated' }, [{ type: 'RunCustomAction', customActionId: CA, customActionInputs: {} }]) }; }
// P26 saved action of a new type
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA AO WF P26 saved comment', type: 'AddTicketComment', action: { type: 'AddTicketComment', commentBody: 'QA AO WF P26 saved comment', commentPublic: false } });
const SA = sa.j?.data?.id; if (SA) track('savedAction', SA, 'P26'); R.sa = [sa.s, SA ? null : sa.t.slice(0, 220)];
if (SA) R.P26 = { rule: await mkRule('P26', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', standaloneActionId: SA }]) };
for (const t of ['P17c', 'P17e', 'P21', 'P22', 'P26']) if (R[t]?.rule?.id) R[t].ticket = await mkTicket(t === 'P21' ? 'P21b' : t);
if (R.P17e?.ticket?.id) { await sleep(6000); R.P17e.patch = await patchTicket(R.P17e.ticket.id, { priority: 'High' }); }
await sleep(25000);
for (const t of ['P17c', 'P17e', 'P21', 'P22', 'P26']) {
  const id = R[t]?.ticket?.id; if (!id) continue; const tk = (await api('GET', '/desk/tickets/' + id)).j?.data || {}; const g = await getTicket(id);
  R[t].after = { owner: String(g.owner || tk.owner_id || '').slice(0, 8) || null, team: tk.team_id || g.team || null, layout: String(tk.layout_id || g.layout_id || '').slice(0, 8) };
  R[t].exec = arr2((await api('GET', '/workflow/executions?recordId=' + id)).j?.data).map(e => e.outcome + ' ' + (e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + String(d.responseBodyTruncated || d.lastError || '').slice(0, 140)).join(' | '));
  if (t === 'P26') R[t].comments = arr2((await api('GET', '/desk/tickets/' + id + '/comments')).j?.data).map(c => String(c.body_html).slice(0, 40));
}
if (SA) { const u = await api('GET', `/workflow/actions/${SA}/usage`); R.usage = [u.s, JSON.stringify(u.j?.data).slice(0, 160)]; }
fs.writeFileSync('../a4/p4.json', JSON.stringify(R, null, 1));
const S = { team: R.team, ca: R.ca, caPublish: R.caPublish, sa: R.sa, usage: R.usage };
for (const t of ['P17c', 'P17e', 'P21', 'P22', 'P26']) S[t] = R[t] ? { rule: R[t].rule.s + (R[t].rule.err || ''), patch: R[t].patch, after: R[t].after, exec: R[t].exec, comments: R[t].comments } : 'not run';
S.TM = TM && TM.slice(0, 8); return S;
