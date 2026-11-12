async (page, ctx, h) => {
  const L='7687862000000091055';
  const afe = { apply_feature_execution: [{ name: 'criteria_validation_rule' }] };
  const mk = async (tag, v, lay=true) => { const rec={ Last_Name: 'QA VR1112 L-'+tag, Company: 'QA VR1112', QA_VR1112_Code: v }; if(lay) rec.Layout={id:L}; const r = await zf(page, 'POST', '/crm/v8/Leads', Object.assign({ data: [rec] }, afe)); return r.s + ' ' + r.t.slice(0, 450); };
  return { X: await mk('afeX','X'), x: await mk('afex','x'), Xnolayout: await mk('afeXn','X',false) };
}
