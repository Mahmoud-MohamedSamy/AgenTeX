async (page, ctx, h) => {
  const r = await zf(page, 'GET', '/crm/v8/settings/validation_rules?module=Leads');
  const l = await zf(page, 'GET', '/crm/v8/settings/layouts?module=Leads');
  const f = await zFields(page, 'Leads');
  return { rules: r.s + ' ' + r.t.slice(0, 800), layouts: (l.j?.layouts||[]).map(x => x.id + ' ' + x.name + ' ' + x.status), fields: f.filter(x=>['text','date','picklist','boolean','email','integer'].includes(x.type)).map(x => x.api_name + ':' + x.type + ':' + x.id).join(', ') };
}
