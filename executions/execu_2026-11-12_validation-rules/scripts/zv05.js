async (page, ctx, h) => {
  const g = await zf(page, 'GET', '/crm/v8/settings/validation_rules/7687862000000765070?module=Leads');
  const mk = async (v, extra={}) => { const r = await zf(page, 'POST', '/crm/v8/Leads', Object.assign({ data: [{ Last_Name: 'QA VR1112 L-'+v, Company: 'QA VR1112', QA_VR1112_Code: v }] }, extra)); return r.s + ' ' + r.t.slice(0, 400); };
  return { rule: g.s + ' ' + g.t.slice(0, 1200), upperX: await mk('X'), lowerx: await mk('x'), ok: await mk('OK1') };
}
