async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); R.ownerVal = await valOf('owner'); R.reasonShown = await vis('qa_lr_reason'); await shot('crm-D5');
  const ui = await page.evaluate(()=>{const w=document.querySelector('[data-rule-field=owner]'); return w? w.innerHTML.slice(0,600):null}); R.ownerHtml = ui;
  return R; }
