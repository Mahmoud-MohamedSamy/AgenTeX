const out = {};
const cf = arr((await api('GET', `/modules/${CONTACTS}/fields`)).j?.data).map(x => x.apiName + ':' + x.datatypeKey).join(' ');
out.contactFields = cf.slice(0, 900);
const teams = (await api('GET', '/desk/teams')).j?.data?.teams || []; out.teams = teams.map(t => t.id + ' ' + t.name + ' dept ' + t.department_id + ' members ' + (t.sources || []).length);
const tpl = (await api('GET', '/desk/email-templates')).j?.data?.email_templates || []; out.tpl = tpl.map(t => t.id + ' ' + (t.name || t.use_case) + ' ' + t.module + ' ' + t.notification_type).slice(0, 12);
const tryA = async (label, a) => { const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF probe ' + label, isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA WF probe '), actions: [{ order: 0, ...a }] }); const id = r.j?.data?.id; if (id) await api('DELETE', `/workflow/rules/${id}`); return r.s + ' ' + (r.s >= 300 ? JSON.stringify(r.j?.error?.details || r.j?.error?.message).slice(0, 300) : 'ok'); };
out.ownerBad = await tryA('owner', { type: 'OwnerAssignment', ownerTargetKind: 'QaBad', ownerValue: 'x' });
out.emailBad = await tryA('email', { type: 'Email', emailRecipients: [{ kind: 'QaBad', value: 'x' }], emailSubject: 's', emailBody: 'b' });
return fin(out);
