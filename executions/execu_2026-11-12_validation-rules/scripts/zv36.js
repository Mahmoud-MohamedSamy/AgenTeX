async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const out = {};
  for (const b of [{ displayLabel: 'QA VR1112 Text', type: 'Text', maxLength: 100 }, { displayLabel: 'QA VR1112 Text', type: 'Text', maxLength: 100, isMandatory: false, toolTip: '' , toolTipType: 'placeHolder'}]) {
    const cf = await zd(d, 'POST', '/organizationFields?module=tickets', b); out['t'+Object.keys(out).length] = cf.s + ' ' + cf.t.slice(0, 400); if (cf.s < 300) break; }
  return out;
}
