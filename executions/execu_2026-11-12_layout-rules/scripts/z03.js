async (page, ctx, h) => {
  const out = {};
  for (const p of ['/crm/v8/settings/layout_rules?module=Leads', '/crm/v2.2/settings/layout_rules?module=Leads', '/crm/v2.1/settings/layout_rules?module=Leads', '/crm/v6/settings/layout_rules?module=Leads', '/crm/v8/settings/layouts?module=Leads']) { const r = await h.crmApi('GET', p); out[p] = r.status + ' ' + r.body.slice(0, 400); }
  return out;
}
