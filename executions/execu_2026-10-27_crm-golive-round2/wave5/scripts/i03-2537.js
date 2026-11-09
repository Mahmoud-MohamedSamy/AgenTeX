// NDC-2537: webhook addresses refused at save (inactive QA rules on the QA module only; deleted at once)
const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842', ME = '7e5e7c27-46e4-4bf6-b021-7bd219d34472';
const res = {}, made = [];
const wf = url => ({ moduleId: M, appKey: 'crm', layoutId: null, departmentIds: [], name: 'QA R2W5 WH ' + url.slice(7, 30), description: null, mode: 'Recurring', isActive: false,
  trigger: { kind: 'RecordCreated', fieldName: null, fieldNames: null, fieldMatch: null, dateFieldName: null, offsetSeconds: null, offsetMode: null }, criteria: null,
  actions: [{ type: 'Webhook', order: 0, delaySeconds: 0, method: 'Post', url, bodyTemplate: '{"id":"${id}"}', headers: {}, timeoutSeconds: 10 }] });
for (const u of ['http://169.254.169.254/latest/meta-data/', 'http://169.254.169.254.nip.io/latest/meta-data/', 'http://127.0.0.1.nip.io/', 'http://10.0.0.5/', 'http://localhost/', 'https://example.com/qa-r2w5']) {
  const r = await call('POST', '/workflow/rules', wf(u)); res['wf ' + u] = r.s + ' ' + r.t.slice(0, 220);
  if (r.s < 300 && r.j && r.j.data) made.push(r.j.data.id || r.j.data.ruleId);
}
const rv = await call('POST', '/workflow/review-processes', { moduleId: M, layoutId: L, name: 'QA R2W5 RV wh', description: null, criteria: null, channels: ['api'], isActive: false,
  fields: [{ fieldApiName: 'qa_text', datatypeKey: 'single_line', subformFieldPath: null, label: 'qa_text' }],
  rules: [{ name: 'Rule 1', criteria: null, reviewers: [{ kind: 'users', values: [ME] }], strategy: 'broadcast', isFallback: false }, { name: 'Others', criteria: null, reviewers: [{ kind: 'users', values: [ME] }], strategy: 'broadcast', isFallback: true }],
  notifications: { onSubmission: false, onReviewCompletion: false, onRejection: false }, sla: null, retentionDays: 90, notifyOnAutoDelete: false, adminUserIds: [], allowAdminEdit: false, webhookUrl: 'http://169.254.169.254/latest/meta-data/' });
res.review = rv.s + ' ' + rv.t.slice(0, 260);
const rvId = rv.s < 300 && rv.j && rv.j.data ? rv.j.data.id : null;
res.cleanup = [];
for (const id of made) res.cleanup.push('wf ' + id + ' -> ' + (await call('DELETE', '/workflow/rules/' + id)).s);
if (rvId) res.cleanup.push('review ' + rvId + ' -> ' + (await call('DELETE', '/workflow/review-processes/' + rvId)).s);
return res;
