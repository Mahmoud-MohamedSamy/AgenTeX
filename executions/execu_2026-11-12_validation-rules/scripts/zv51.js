async (page, ctx, h) => {
  const out = {};
  const L='7687862000000091055';
  out.delFieldWithRule = (await zf(page, 'DELETE', '/crm/v8/settings/fields/7687862000000765060?module=Leads')).t.slice(0, 300);
  out.ruleAfter = (await zf(page, 'GET', '/crm/v8/settings/validation_rules?module=Leads&layout_id='+L)).t.slice(0, 200);
  out.delRule = (await zf(page, 'DELETE', '/crm/v8/settings/validation_rules/7687862000000765070?module=Leads&layout_id='+L)).t.slice(0, 200);
  out.delField2 = (await zf(page, 'DELETE', '/crm/v8/settings/fields/7687862000000765060?module=Leads')).t.slice(0, 200);
  const s = await zf(page, 'GET', '/crm/v8/Leads/search?word=' + encodeURIComponent('QA VR1112'));
  const ids = ['7687862000000765076','7687862000000765078','7687862000000765080','7687862000000765082','7687862000000765084','7687862000000765101','7687862000000765103','7687862000000765105'];
  for (const r of (s.j?.data||[])) if (!ids.includes(r.id) && /QA VR1112/.test(r.Last_Name||'')) ids.push(r.id);
  out.delLeads = (await zf(page, 'DELETE', '/crm/v8/Leads?ids=' + ids.join(','))).t.slice(0, 200) + ' n=' + ids.length;
  out.fieldsLeft = (await zFields(page, 'Leads')).filter(f => /VR1112/.test(f.label)).length;
  const d = await zdPage(ctx);
  await d.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets', { waitUntil: 'domcontentloaded' }).catch(()=>0);
  await d.waitForTimeout(5000);
  out.deskDel = (await zd(d, 'DELETE', '/organizationFields/1475109000000528009?module=tickets')).t.slice(0, 200);
  out.deskLeft = ((await zd(d, 'GET', '/organizationFields?module=tickets')).j?.data||[]).filter(f => /vr1112/i.test(f.apiName)).length;
  out.deskRules = (await zd(d, 'GET', '/validationRules?module=tickets')).t.slice(0, 100);
  return out;
}
