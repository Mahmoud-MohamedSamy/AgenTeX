async (page, ctx, h) => {
  const afe = { apply_feature_execution: [{ name: 'criteria_validation_rule' }] };
  const mk = async (tag, v) => { const rec={ Last_Name: 'QA VR1112 L-'+tag, Company: 'QA VR1112' }; if (v!==null) rec.QA_VR1112_Code=v; const r = await zf(page, 'POST', '/crm/v8/Leads', Object.assign({ data: [rec] }, afe)); const j=r.j; const e=j?.data?.[0]; return r.s+' '+(e?.code==='SUCCESS'? 'id='+e.details.id : JSON.stringify(e?.details?.errors?.map(x=>x.details?.map(d=>d.validation_rules?.conditions?.map(c=>c.alert)))||e).slice(0,300)); };
  return { Y: await mk('d20Y','Y'), X: await mk('d20X','X'), empty: await mk('d14e',null), emptyStr: await mk('d14s',''), OK2: await mk('ok2','OK2') };
}
