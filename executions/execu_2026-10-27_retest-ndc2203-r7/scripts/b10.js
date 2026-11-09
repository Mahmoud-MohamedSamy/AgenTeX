const out = {}; const TEAM = '1adfefb7-0c25-4484-ae92-782964695054';
const t = await api('POST', '/desk/email-templates', { name: 'QA WF D2 template', subject: 'QA WF D2 alert {{ticket.subject}}', body_html: '<p>QA WF D2 alert for ticket {{ticket.number}}</p>', module: 'desk_tickets', notification_type: 'contact' });
const TPL = t.j?.data?.id || t.j?.data?.email_template?.id; out.tpl = t.s + ' ' + (TPL || t.t.slice(0, 300)); if (TPL) track('emailTemplate', TPL, 'D2');
if (TPL) {
  out.rule = await mkRule('D2', { kind: 'RecordCreated' }, [{ type: 'Email', emailTemplateId: TPL, emailRecipients: [{ kind: 'Contact', value: '' }, { kind: 'User', value: ME }] }]);
  // Team / Role recipients: validate only (inactive rule, deleted)
  for (const [k, v] of [['Team', TEAM], ['Role', 'manager']]) { const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF probe ' + k, isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA WF probe '), actions: [{ order: 0, type: 'Email', emailTemplateId: TPL, emailRecipients: [{ kind: k, value: v }] }] }); if (r.j?.data?.id) await api('DELETE', `/workflow/rules/${r.j.data.id}`); out['validate ' + k] = r.s + ' ' + (r.s >= 300 ? (r.j?.error?.message || '') + JSON.stringify(r.j?.error?.details || '').slice(0, 200) : 'accepted'); }
  const tk = (await mkTicket('D2')).id; out.t = tk; await sleep(15000);
  out.disp = arr((await api('GET', `/workflow/executions?recordId=${tk}`)).j?.data).flatMap(e => (e.dispatches || []).map(x => x.actionType + ' ' + x.status + ' ' + x.target + ' ' + (x.responseBodyTruncated || x.lastError || '').slice(0, 220)));
}
return fin(out);
