out.p = {}; for (const r of ['/settings/automation/support-plans', '/settings/developer/custom-actions', '/settings/automation/ai-tagging', '/settings/tickets/archiving']) {
  await go(r, 10000); const t = (await page.locator('#main-content').innerText().catch(() => '')).replace(/\s+/g, ' '); const i = t.lastIndexOf('Email Providers');
  out.p[r] = page.url().replace(H, '').split('?')[0] + ' :: ' + (i > 0 ? t.slice(i + 15, i + 400) : t.slice(0, 400)); await shot('w3/W3-35-agentC' + r.replace(/\//g, '_')); }
out.api = {}; for (const p of ['/desk/sla/support-plans?department_id=' + MK, '/workflow/custom-actions/sources', '/workflow/custom-actions/variables', '/desk/tickets/archive/settings', '/desk/tickets/spam/settings', '/desk/tickets/parent-child/settings']) { const r = await api('GET', p); out.api[p] = r.s; }
out.put = {}; out.put.archive = (await api('PUT', '/desk/tickets/archive/settings', { enabled: false, inactive_days: 120, closed_only: true })).s; out.put.parentChild = (await api('PUT', '/desk/tickets/parent-child/settings', { parent_close_behavior: 'none', auto_close_parent: false })).s;
out.put.plan = (await api('POST', '/desk/sla/support-plans', { department_id: MK, name: 'QA GL W3 agentC plan', description: null, type: 'unlimited', allowance: null, cycle: null, carry_forward: false, allow_additional_usage: false, policy_id: '4283701b-5654-4d3c-a168-7dd7a7860af4' })).s;
out.put.variable = (await api('POST', '/workflow/custom-actions/variables', { name: 'qa_gl_w3_agentc', scope: 'shared', value: 'x', isSecret: false })).s;
return fin({ out });
