// A4 batch 7 (12 Nov): I19 email to role + user field, I20 template deleted, I21 scheduled email (60 s).
const R = {}; const cut = (x, n = 300) => String(typeof x === 'string' ? x : JSON.stringify(x)).slice(0, n);
const MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const r = await api('GET', '/desk/email-templates?per_page=200'); const d = r.j?.data;
const L = Array.isArray(d) ? d : (d?.items || d?.templates || d?.data || Object.values(d || {}).find(Array.isArray) || []);
const custom = L.filter(t => t.use_case == null); R.custom = custom.map(t => [t.id, t.name, t.notification_type, t.is_active].join(' | '));
const base = custom.find(t => t.is_active !== false) || custom[0];
const disp = async (tid, secs = 60) => { await waitExec(tid, 1, secs); await sleep(8000); const raw = arr2((await api('GET', '/workflow/executions?recordId=' + tid)).j?.data).filter(e => e.outcome === 'Fired'); const out = []; for (const e of raw) { const x = (await api('GET', '/workflow/executions/' + e.id)).j?.data; out.push((x?.dispatches || []).map(y => [y.actionType || y.type, y.status, y.attempts, y.lastError || y.errorMessage || '', y.scheduledFor || y.dueAt || ''].join(' ').slice(0, 220))); } return out; };
if (base) {
  // I20: a copy of the custom template, used then deleted
  const nt = await api('POST', '/desk/email-templates', { name: 'QA AO WF I20 tpl', module: base.module || 'desk_tickets', notification_type: base.notification_type, subject: 'QA AO WF I20 {{ticket.subject}}', body_html: '<p>QA AO WF I20</p>' });
  const tid = nt.j?.data?.id; R.I20_create = nt.s + ' ' + (tid || cut(nt.t, 200));
  if (tid) {
    const ru = await mkRule('I20', { kind: 'RecordCreated' }, [{ type: 'Email', emailRecipients: [{ kind: 'user', value: SAMY }], emailTemplateId: tid, emailSubject: 'x', emailBody: 'x' }]);
    R.I20_rule = ru.s + (ru.err || '');
    const del = await api('DELETE', '/desk/email-templates/' + tid); R.I20_deleteTpl = del.s + ' ' + cut(del.t, 220);
    const t = await mkTicket('I20'); R.I20_dispatch = await disp(t.id);
  }
  // I19
  const r19 = await mkRule('I19', { kind: 'RecordCreated' }, [{ type: 'Email', emailRecipients: [{ kind: 'role', value: MGR }, { kind: 'userfield', value: 'owner' }], emailTemplateId: base.id, emailSubject: 'x', emailBody: 'x' }]);
  R.I19_rule = r19.s + (r19.err || '');
  if (r19.id) { const t = await mkTicket('I19'); R.I19_dispatch = await disp(t.id); }
  // I21
  const r21 = await mkRule('I21', { kind: 'RecordCreated' }, [{ type: 'Email', delaySeconds: 60, emailRecipients: [{ kind: 'user', value: SAMY }], emailTemplateId: base.id, emailSubject: 'x', emailBody: 'x' }]);
  R.I21_rule = r21.s + (r21.err || '');
  if (r21.id) { const t = await mkTicket('I21'); await sleep(15000); R.I21_at15s = await disp(t.id, 20); await sleep(80000); R.I21_at100s = await disp(t.id, 10); }
}
fs.writeFileSync('../a4/b7.json', JSON.stringify(R, null, 1));
return R;
