const qa = x => JSON.stringify(x || '').includes('QA GL W3') || /qa_gl_w3|qa-gl-w3/.test(JSON.stringify(x || ''));
const L = async p => { const r = await api('GET', p); const d = D(r.j); return { s: r.s, d }; };
out.plans = (await L('/desk/sla/support-plans?department_id=' + MK)).d; out.plansDisc = (await L('/desk/sla/support-plans?department_id=' + MK + '&status=discontinued')).d;
out.policies = (await L('/desk/sla/policies?department_id=' + MK)).d;
const ca = (await L('/workflow/custom-actions')).d; out.actionsQA = (ca || []).filter(qa).map(a => a.name); out.actionsN = (ca || []).length;
out.sourcesQA = ((await L('/workflow/custom-actions/sources')).d || []).filter(qa).map(a => a.name);
out.varsQA = ((await L('/workflow/custom-actions/variables')).d || []).filter(qa).map(a => a.name);
out.spamContacts = (await L('/desk/channels/spam-contacts')).d;
out.settings = { archive: (await L('/desk/tickets/archive/settings')).d, spam: (await L('/desk/tickets/spam/settings')).d, pc: (await L('/desk/tickets/parent-child/settings')).d, dataArchive: (await L('/desk/data/archive/settings')).d };
const base = JSON.parse(JSON.stringify(out.settings)); out.baselineMatch = JSON.stringify(base.archive) === '{"enabled":false,"inactive_days":120,"closed_only":true}' && JSON.stringify(base.spam) === '{"enabled":true,"retention_days":30,"auto_spam_contacts_enabled":false,"auto_spam_contacts_threshold":3}' && JSON.stringify(base.pc) === '{"parent_close_behavior":"none","auto_close_parent":false}';
let bin = []; for (let p = 0; p < 6; p++) { const rb = await api('GET', '/audit/recycle-bin/items?limit=200' + (p ? '&page=' + (p + 1) : '')); const it = arr(D(rb.j)); bin.push(...it.filter(i => /QA GL W3|qa-gl-w3/.test(JSON.stringify(i)))); if (it.length < 200) break; } out.binQA = bin.map(i => i.module_label + ':' + i.record_label);
for (const [k, m] of [['tickets', TM], ['contacts', CM], ['accounts', AM], ['contracts', KM]]) { const f = [{ field: k === 'tickets' ? 'subject' : (k === 'contacts' ? 'first_name' : (k === 'accounts' ? 'account_name' : 'contract_name')), operator: 'contains', value: 'QA GL W3' }]; const r = await api('GET', '/modules/' + m + '/records?page=1&per_page=5&filters=' + encodeURIComponent(JSON.stringify(f))); out['rec_' + k] = r.s + ' ' + (D(r.j)?.total_count ?? arr(D(r.j)).length); }
await go('/settings/automation/workflow-rules?department=' + MK, 10000); out.rulePage = /QA GL W3/.test(await mtxt());
out.lang = await page.evaluate(() => document.documentElement.lang);
return fin({ out });
