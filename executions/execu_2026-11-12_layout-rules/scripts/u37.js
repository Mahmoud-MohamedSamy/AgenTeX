async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  const errsC = []; page.on('console', m => { if (m.type() === 'error') errsC.push(m.text().slice(0, 150)); });
  await openCreate(mid, lid); const t0 = Date.now(); await pick('qa_lr_tier', 'Silver');
  const vals = []; for (let k = 0; k < 6; k++) { vals.push([await valOf('qa_lr_tier'), await valOf('qa_lr_filter')].join('/')); await sleep(500); } R.vals = vals;
  R.responsive = await page.evaluate(() => new Promise(r => { const s = performance.now(); setTimeout(() => r(Math.round(performance.now() - s)), 50); }));
  R.ms = Date.now() - t0; R.console = errsC.slice(0, 5); await shot('crm-H5');
  return R; }
