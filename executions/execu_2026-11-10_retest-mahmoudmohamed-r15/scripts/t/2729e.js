await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(3000);
await page.getByRole('tab', { name: /Transition/i }).first().click().catch(()=>{}); await sleep(1500);
await page.getByText('After', { exact: true }).first().click(); await sleep(2500);
const out = {};
for (const kind of ['Create task','Meeting','Call','Create record']) {
  await page.getByRole('button', { name: kind, exact: true }).first().click(); await sleep(2500);
  const cards = page.locator('button[aria-label="Remove action"]');
  const n = await cards.count();
  const card = cards.nth(n-1).locator('xpath=ancestor::*[.//select or .//input or .//*[@role="combobox"]][1]');
  const info = await card.evaluate(el => {
    const res = { text: el.innerText.slice(0, 2500), controls: [] };
    el.querySelectorAll('select,input,textarea,[role=combobox],button[aria-haspopup]').forEach(c => {
      const lab = (c.closest('label')||{}).innerText || c.getAttribute('aria-label') || c.getAttribute('placeholder') || '';
      let v; if (c.tagName==='SELECT') v = { sel: c.options[c.selectedIndex] && c.options[c.selectedIndex].text, opts: [...c.options].map(o=>o.text).slice(0,12) }; else v = c.value || c.innerText;
      res.controls.push({ tag: c.tagName, type: c.type, lab: lab.slice(0,60), v });
    }); return res; });
  out[kind] = info;
  await card.scrollIntoViewIfNeeded().catch(()=>{});
  await card.screenshot({ path: require('path').join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15/screenshots/raw','2729-'+kind.replace(/ /g,'_')+'.png') }).catch(e=>log('shotErr',String(e).slice(0,100)));
}
require('fs').writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15/out/2729-actions.json', JSON.stringify(out,null,1));
log(Object.keys(out).map(k=>k+': '+out[k].controls.length+' controls'));
// leave without saving
