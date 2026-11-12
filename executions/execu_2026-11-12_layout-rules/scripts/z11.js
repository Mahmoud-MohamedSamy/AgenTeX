async (page) => {
  const V = 'ASP (Application Service Provider)'; const L = { id: '7687862000000091055' };
  const a = await zf(page, 'POST', '/crm/v8/Leads', { data: [{ Last_Name: 'QA LR1112 z api1', Company: 'QA LR1112', Industry: V, Layout: L }] });
  const b = await zf(page, 'POST', '/crm/v8/Leads', { data: [{ Last_Name: 'QA LR1112 z api2', Company: 'QA LR1112', Industry: V, Layout: L }], apply_feature_execution: [{ name: 'layout_rules' }] });
  return { plain: a.s + ' ' + a.t.slice(0, 260), withFlag: b.s + ' ' + b.t.slice(0, 400) };
}
