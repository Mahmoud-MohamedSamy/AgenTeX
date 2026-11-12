async (page, ctx) => {
  const out = {}; const LAY = '7687862000000091055';
  const lr = await zf(page, 'GET', '/crm/v9/settings/layout_rules?module=Leads');
  const rules = (lr.j && lr.j.layout_rules) || []; out.rulesBefore = rules.map(r => r.name);
  out.ruleDel = []; for (const r of rules) if (/^QA LR1112/.test(r.name)) { const d = await zf(page, 'DELETE', '/crm/v9/settings/layout_rules/' + r.id + '?module=Leads&layout_id=' + ((r.layout && r.layout.id) || LAY)); out.ruleDel.push(r.name + ' ' + d.s); }
  const s = await zf(page, 'GET', '/crm/v8/Leads/search?word=' + encodeURIComponent('QA LR1112'));
  const leads = ((s.j && s.j.data) || []).filter(x => /QA LR1112/.test((x.Last_Name || '') + (x.Company || ''))); out.leads = leads.map(x => x.Last_Name);
  if (leads.length) { const d = await zf(page, 'DELETE', '/crm/v8/Leads?ids=' + leads.map(x => x.id).join(',')); out.leadDel = d.s + ' ' + d.t.slice(0, 200); }
  // Zoho Desk: QA rules on the Tickets layout
  const p = await zdPage(ctx); const L = '1475109000000439896'; const dl = await zd(p, 'GET', '/layouts/' + L + '/layoutRules');
  const drs = (dl.j && (dl.j.data || dl.j.layoutRules)) || []; out.deskRules = drs.map(r => r.name); out.deskDel = [];
  for (const r of drs) if (/^QA LR1112/.test(r.name)) { const d = await zd(p, 'DELETE', '/layouts/' + L + '/layoutRules/' + r.id); out.deskDel.push(r.name + ' ' + d.s); }
  const after = await zf(page, 'GET', '/crm/v9/settings/layout_rules?module=Leads'); out.rulesAfter = ((after.j && after.j.layout_rules) || []).map(r => r.name);
  return out;
}
