async (page, ctx, h) => {
  const L='7687862000000091055';
  const g = await zf(page, 'GET', '/crm/v8/settings/validation_rules/7687862000000765070?module=Leads&layout_id='+L);
  const mk = async (tag, extra={}, rec={}) => { const r = await zf(page, 'POST', '/crm/v8/Leads', Object.assign({ data: [Object.assign({ Last_Name: 'QA VR1112 L-'+tag, Company: 'QA VR1112', QA_VR1112_Code: 'X' }, rec)] }, extra)); return r.s + ' ' + r.t.slice(0, 350); };
  return { rule: g.s + ' ' + g.t.slice(0, 1500),
    withLayout: await mk('lay', {}, { Layout: { id: L } }),
    afeVal: await mk('afev', { apply_feature_execution: [{ name: 'validation_rules' }] }, { Layout: { id: L } }),
    trig: await mk('trig', { trigger: ['workflow'] }, { Layout: { id: L } }) };
}
