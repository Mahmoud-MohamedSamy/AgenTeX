async (page, ctx, h) => {
  const out = {}; const L='7687862000000091055';
  const g = await zf(page, 'GET', '/crm/v8/settings/validation_rules?module=Leads&layout_id='+L);
  out.rules = (g.j?.validation_rules||[]).map(r => r.id + ' ' + r.field?.api_name + ' active=' + r.active);
  for (const p of ['/crm/v8/settings/validation_rules?module=Leads&layout_id='+L+'&ids=7687862000000765070', '/crm/v8/settings/validation_rules/7687862000000765070?module=Leads']) {
    if ((out.rules||[]).length === 0) break;
    out['del '+p.slice(31,60)] = (await zf(page, 'DELETE', p)).t.slice(0, 160);
    out.rules = ((await zf(page, 'GET', '/crm/v8/settings/validation_rules?module=Leads&layout_id='+L)).j?.validation_rules||[]).map(r => r.id);
  }
  out.leadsLeft = (await zf(page, 'GET', '/crm/v8/Leads/search?word=VR1112')).s;
  const d = await zdPage(ctx);
  out.deskDel = (await zd(d, 'DELETE', '/organizationFields/1475109000000528009')).s;
  out.deskLeft = ((await zd(d, 'GET', '/organizationFields?module=tickets')).j?.data||[]).filter(f => /vr1112/i.test(f.apiName)).length;
  return out;
}
