async (page) => {
  const F = await zFields(page, 'Leads'); const fid = n => F.find(f => f.api_name === n).id; const el = n => ({ type: 'fields', resource: { id: fid(n), api_name: n } });
  const crit = (f, v) => ({ comparator: 'equal', field: { api_name: f, id: fid(f) }, value: v });
  const mk = async (name, pf, pv, acts, extraSub = []) => { const body = { layout_rules: [{ name, description: 'qa', primary_field: { api_name: pf, id: fid(pf) }, conditions: [{ sequence_number: 1, primary_condition: crit(pf, pv), sub_conditions: [{ sequence_number: 1, criteria: crit(pf, pv), actions: acts }, ...extraSub] }] }] }; return zf(page, 'POST', '/crm/v9/settings/layout_rules?module=Leads&layout_id=7687862000000091055', body); };
  const out = {};
  const a1 = { s: 'done before' };
  const a2 = await mk('QA LR1112 z mand ro', 'Industry', 'ASP', [{ action_type: 'set_mandatory', elements: [el('Fax')] }, { action_type: 'set_read_only', elements: [el('Fax')] }]); out.F16_mand_ro = a2.s + ' ' + a2.t.slice(0, 400);
  const a3 = await mk('QA LR1112 z num primary', 'Annual_Revenue', '100', [{ action_type: 'show_fields', elements: [el('Mobile')] }]); out.Z1_currency_primary = a3.s + ' ' + a3.t.slice(0, 300);
  const a4 = await mk('QA LR1112 z email primary', 'Email', 'a@b.com', [{ action_type: 'show_fields', elements: [el('Secondary_Email')] }]); out.Z1_email_primary = a4.s + ' ' + a4.t.slice(0, 300);
  return out;
}
