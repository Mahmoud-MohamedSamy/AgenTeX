// NDC-2294 items 6, 10, 11 on the QA module qa_rt_r8 (064aa360): review process (inactive, deleted), scheduled Field Update (rule kept for cleanup).
const M = '064aa360-7e4b-4e0b-9e68-831c469fa6e9', ME = '3445ec4a-020e-4f12-b156-dd2de7610164'; const out = {};
const lay = arr((await api('GET', `/modules/${M}/layouts`)).j?.data)[0]?.id;
const crit = { kind: 'StringMatch', field: 'name', operator: 'StartsWith', stringValue: 'QA RT r8 REV', caseInsensitive: false, negate: null };
const rp = { moduleId: M, layoutId: lay, name: 'QA RT r8 review', description: null, criteria: crit, channels: ['Api'], isActive: false, fields: [{ fieldApiName: 'qa_colour', datatypeKey: 'pick_list', subformFieldPath: null, label: 'qa_colour' }],
  rules: [{ name: 'Rule 1', criteria: null, reviewers: [{ kind: 'users', values: [ME] }], strategy: 'broadcast', isFallback: false }, { name: 'Others', criteria: null, reviewers: [{ kind: 'users', values: [ME] }], strategy: 'broadcast', isFallback: true }],
  notifications: { onSubmission: false, onReviewCompletion: false, onRejection: false }, sla: null, retentionDays: 90, notifyOnAutoDelete: false, adminUserIds: [], allowAdminEdit: false, webhookUrl: null,
  rejectionReasons: [{ labelEn: 'QA RT r8 reason A', labelAr: 'سبب أ', orderIndex: 0 }, { labelEn: 'QA RT r8 reason B', labelAr: null, orderIndex: 1 }] };
const c = await api('POST', '/workflow/review-processes', rp); const rid = c.j?.data?.id; out.reviewCreate = c.s + ' ' + (rid || c.t.slice(0, 300));
if (rid) { const g = (await api('GET', '/workflow/review-processes/' + rid)).j?.data; out.reasonsStored = JSON.stringify(g?.rejectionReasons); out.eventFunctionsKey = JSON.stringify(g?.eventFunctions);
  const ef = await api('PUT', '/workflow/review-processes/' + rid, { ...g, eventFunctions: [{ event: 'submission', customActionId: '00000000-0000-0000-0000-000000000000', customActionInputs: {} }] }); out.eventFunctionsFake = ef.s + ' ' + ef.t.slice(0, 260);
  const glob = await api('GET', '/workflow/review-rejection-reasons'); out.globalReasons = glob.s + ' ' + JSON.stringify(arr(glob.j?.data).map(x => x.labelEn || x.label)).slice(0, 200);
  out.reviewDelete = (await api('DELETE', '/workflow/review-processes/' + rid)).s; }
// scheduled Field Update: colour → Green 120 s after create
const wf = { moduleId: M, appKey: 'crm', layoutId: null, departmentIds: [], name: 'QA RT r8 sched FU', description: null, mode: 'Recurring', isActive: false,
  trigger: { kind: 'RecordCreated', fieldName: null, fieldNames: null, fieldMatch: null, dateFieldName: null, offsetSeconds: null, offsetMode: null },
  criteria: { kind: 'StringMatch', field: 'name', operator: 'StartsWith', stringValue: 'QA RT r8 SCHED', caseInsensitive: false, negate: null },
  actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 120, fieldUpdates: { qa_colour: { kind: 'string', stringValue: 'Green' } } }] };
const w = await api('POST', '/workflow/rules', wf); const wid = w.j?.data?.id; out.wfCreate = w.s + ' ' + (wid || w.t.slice(0, 300));
if (wid) { out.wfStoredAction = JSON.stringify((await api('GET', '/workflow/rules/' + wid)).j?.data?.actions?.[0]).slice(0, 300); out.activate = (await api('POST', `/workflow/rules/${wid}/activate`)).s;
  const enc = v => ({ kind: 'string', value: String(v) });
  const r = await api('POST', `/modules/${M}/records`, { layout_id: lay, data: [['name', 'QA RT r8 SCHED 1'], ['qa_colour', 'Red'], ['qa_child', 'A']].map(([f, v]) => ({ field: f, value: enc(v) })) }); out.rec = r.j?.data?.id; out.recAt = new Date().toISOString();
  await sleep(15000); const g = (await api('GET', `/modules/${M}/records/${out.rec}`)).j?.data?.data || []; out.colourAfter15s = JSON.stringify(g.find(x => x.field === 'qa_colour')?.value); out.wid = wid; }
return done(out);
