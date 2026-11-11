await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(3000);
await page.getByRole('tab', { name: /Transition/i }).first().click().catch(()=>{}); await sleep(1500);
await page.getByText('After', { exact: true }).first().click(); await sleep(2500);
const panel = await text(); const i = panel.indexOf('After'); log(panel.slice(panel.indexOf('Before'), panel.indexOf('Before')+2500));
await shot('2729-after.png');
const btns = await page.$$eval('button', bs => bs.map(b => (b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean)); log(btns.filter(b=>/task|meeting|call|record|email|field|notification|webhook|tag|action/i.test(b)));
