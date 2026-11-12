async (page, ctx, h) => {
  const r = await h.crmApi('GET', '/crm/v9/settings/layout_rules/7687862000000698537?module=Leads&layout_id=7687862000000091055');
  return r.status + ' ' + r.body.slice(0, 4000);
}
