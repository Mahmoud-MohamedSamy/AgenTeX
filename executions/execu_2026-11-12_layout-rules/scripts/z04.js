async (page, ctx, h) => {
  const r = await h.crmApi('GET', '/crm/v9/settings/layout_rules?module=Leads');
  return r.status + ' ' + r.body.slice(0, 3000);
}
