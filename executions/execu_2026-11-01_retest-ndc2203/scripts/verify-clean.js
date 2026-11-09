const done = o => o; const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const rules = arr((await api('GET', '/workflow/rules?take=200')).j?.data);
const lays = arr((await api('GET', `/modules/${T}/layouts`)).j?.data).map(l => l.name);
const sa = arr((await api('GET', '/workflow/actions')).j?.data).filter(a => /^QA WF/.test(a.name)).length;
const ca = arr((await api('GET', '/workflow/custom-actions')).j?.data).filter(a => /^QA WF/.test(a.name)).length;
const tpl = ((await api('GET', '/desk/email-templates')).j?.data?.email_templates || []).filter(t => /^QA WF/.test(t.name)).length;
let qaTickets = 0; for (let p = 1; p <= 4; p++) { const r = arr((await api('GET', `/modules/${T}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`)).j?.data); qaTickets += r.filter(x => (x.data || []).some(f => f.field === 'subject' && /^QA WF /.test(f.value?.value || ''))).length; if (r.length < 100) break; }
return { rules: rules.map(r => ({ id: r.id, name: r.name, active: r.isActive, version: r.version })), layouts: lays, qaSavedActions: sa, qaCustomActions: ca, qaTemplates: tpl, qaTicketsVisibleToAdmin: qaTickets };
