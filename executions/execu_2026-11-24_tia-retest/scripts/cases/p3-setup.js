// Phase 3 preflight (P-02, P-04) as OWN. STEP=base|crm|desk. Writes out/p3-baseline.json and out/p3-ids.json.
const STEP = process.env.STEP; const IDF = RUN + '/out/p3-ids.json'; const BF = RUN + '/out/p3-baseline.json';
const I = fs.existsSync(IDF) ? JSON.parse(fs.readFileSync(IDF, 'utf8')) : {}; const save = () => fs.writeFileSync(IDF, JSON.stringify(I, null, 1));
const S = v => ({ kind: 'string', value: String(v) });
const recData = o => Object.entries(o).map(([field, v]) => ({ field, value: S(v) }));
const CRM_M_USER = '3445ec4a-020e-4f12-b156-dd2de7610164';
if (STEP === 'base') {
  const a = await getAgent(); const p = await api('GET', '/ai/policy'); const rs = await api('GET', '/agents/runtime-settings'); const ss = await api('GET', '/agents/runtime-settings/tia-strong-steps');
  const profs = arr((await api('GET', '/iam/profiles?limit=200')).j?.data); const crmM = profs.find(x => /^crm manager$/i.test(x.name || '')) || profs.find(x => /manager/i.test(x.name || ''));
  const cnt = async id => { const r = await api('GET', `/iam/profiles/${id}/permissions`); const d = r.j?.data; return (Array.isArray(d) ? d : d?.permissions || []).length; };
  const fp = await api('GET', `/modules/${M.leads}/field-permissions`);
  const B = { at: stamp(), agent: { id: a.id, ver: a.deployed_version_no, def: a.draft_definition }, policy: { ver: p.j?.data?.version, tia: p.j?.data?.descriptor?.features?.tia }, runtime: rs.j?.data, strong: ss.j?.data, deskAgentPerms: await cnt(DESK_AGENT_PROFILE), crmManager: crmM && { id: crmM.id, name: crmM.name, perms: await cnt(crmM.id) }, leadsFieldPerms: arr(fp.j?.data) };
  fs.writeFileSync(BF, JSON.stringify(B, null, 1)); I.crmManagerProfile = crmM?.id; save();
  return { ver: B.agent.ver, policy: B.policy, deskAgentPerms: B.deskAgentPerms, crmManager: B.crmManager, leadsFieldPerms: B.leadsFieldPerms.length, strong: JSON.stringify(B.strong).slice(0, 200), runtime: JSON.stringify(B.runtime).slice(0, 300) };
}
if (STEP === 'crm') {
  const o = {};
  const mk = async (key, data) => { if (I[key]) return; const r = await api('POST', `/modules/${M.leads}/records`, { data: recData(data) }); I[key] = r.j?.data?.id || null; o[key] = r.s + (I[key] ? '' : ' ' + (r.t || '').slice(0, 200)); if (I[key]) ledger(`P3: lead ${key} ${I[key]} — delete in R`); };
  await mk('leadA', { name: 'QA TIA P3 Lead A', first_name: 'QA TIA P3', last_name: 'Lead A', company: 'QA P3 Co', lead_source: 'Web', single_line_3_9: 'QA' });
  await mk('leadB', { name: 'QA TIA P3 Lead B', first_name: 'QA TIA P3', last_name: 'Lead B', company: 'QA P3 Co', single_line: 'QA-P3-SECRET', single_line_3_9: 'QA-P3-B', owner: CRM_M_USER });
  await mk('leadLock', { name: 'QA TIA P3 Lock Lead', first_name: 'QA TIA P3 Lock', last_name: 'Lead', company: 'QA P3 Lock Co' });
  // field permission: Single Line Permission (single_line_3_9) read-only for CRM Manager
  const F = arr((await api('GET', `/modules/${M.leads}/fields`)).j?.data); const f39 = F.find(f => f.apiName === 'single_line_3_9'); const fsl = F.find(f => f.apiName === 'single_line'); I.f39 = f39?.id; I.fsl = fsl?.id;
  const fpl = arr((await api('GET', `/modules/${M.leads}/field-permissions`)).j?.data);
  o.existing = fpl.filter(x => x.profileId === I.crmManagerProfile).map(x => x.fieldName + '=' + x.permission);
  if (!fpl.find(x => x.profileId === I.crmManagerProfile && x.fieldName === 'single_line_3_9')) { const r = await api('POST', `/modules/${M.leads}/field-permissions`, { fieldId: I.f39, profileId: I.crmManagerProfile, permission: 'read_only' }); o.fpRO = r.s + ' ' + (r.t || '').slice(0, 150); I.fpRO = r.j?.data?.id || 'created'; ledger(`P3: field permission single_line_3_9 read_only for CRM Manager (${r.s}) — remove in R`); }
  // validation rule: blocks Single Line Permission = QA-P3-BLOCK (no real record uses it)
  if (!I.vr) { const r = await api('POST', `/modules/${M.leads}/validation-rules`, { name: 'QA TIA P3 VR', condition: "single_line_3_9 == 'QA-P3-BLOCK'", errorMessage: { en: 'QA TIA P3 VR: this value is not allowed' } }); I.vr = r.j?.data?.id || null; o.vr = r.s + ' ' + (I.vr ? '' : (r.t || '').slice(0, 200)); if (I.vr) ledger(`P3: validation rule QA TIA P3 VR ${I.vr} — delete in R`); }
  // record lock on first_name starts with "QA TIA P3 Lock"
  if (!I.lock) { const bodies = [{ name: 'QA TIA P3 Lock', condition: { pattern: '1', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA TIA P3 Lock' }] } }, { name: 'QA TIA P3 Lock', condition: { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'QA TIA P3 Lock' } }];
    for (const b of bodies) { const r = await api('POST', `/modules/${M.leads}/record-locks`, b); o['lock'] = r.s + ' ' + (r.t || '').slice(0, 200); if (r.s < 300) { I.lock = r.j?.data?.id; ledger(`P3: record lock QA TIA P3 Lock ${I.lock} — delete in R`); break; } } }
  // workflow rule on Leads (create + edit), criteria first_name starts with QA TIA P3 WF, action: task
  if (!I.wf) { const r = await api('POST', '/workflow/rules', { moduleId: M.leads, appKey: 'crm', name: 'QA TIA P3 WF', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: { conditions: [{ field_key: 'first_name', operator: 'starts_with', value: 'QA TIA P3 WF' }], pattern: '1' }, actions: [{ order: 0, type: 'Task', taskTitle: 'QA TIA P3 task', taskDescription: 'QA TIA P3 WF', taskDueOffsetDays: 1 }] }); I.wf = r.j?.data?.id || null; o.wf = r.s + ' ' + (I.wf ? '' : (r.t || '').slice(0, 300)); if (I.wf) ledger(`P3: workflow rule QA TIA P3 WF ${I.wf} — delete in R`); }
  // record lock check: is the lock lead locked?
  const lk = await api('GET', `/modules/${M.leads}/records/${I.leadLock}`); o.lockLead = lk.s + ' locked=' + JSON.stringify(lk.j?.data?.lock || lk.j?.data?.is_locked || lk.j?.data?.locked || null);
  save(); return o;
}
if (STEP === 'desk') {
  const o = {}; const T = M.tickets;
  const L = arr((await api('GET', `/modules/${T}/layouts`)).j?.data); const std = L.find(l => /standard/i.test(l.name || '')) || L[0]; I.tLayout = std?.id;
  const tk = async (key, subj, dept) => { if (I[key]) return; const r = await api('POST', `/modules/${T}/records`, { layout_id: I.tLayout, data: [{ field: 'subject', value: S(subj) }, { field: 'department', value: S(dept) }, { field: 'status', value: S('Open') }, { field: 'priority', value: S('Low') }] }); I[key] = r.j?.data?.id || null; o[key] = r.s + (I[key] ? '' : ' ' + (r.t || '').slice(0, 200)); if (I[key]) ledger(`P3: ticket ${subj} ${I[key]} — delete in R`); };
  const DEPT_B = '4853562a-0b4d-45cb-ba34-9f2118fcd32c';
  for (const n of [1, 2, 3, 4]) await tk('t' + n, 'QA TIA P3 T' + n, DEPT_A);
  await tk('tOther', 'QA TIA P3 Other', DEPT_B);
  save(); return o;
}
