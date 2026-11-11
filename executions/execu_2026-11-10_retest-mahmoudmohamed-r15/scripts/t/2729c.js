await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(3000);
const tab = page.getByRole('tab', { name: /Transition/i }); if (await tab.count()) await tab.first().click(); await sleep(2000);
log((await text()).slice(-3500)); await shot('2729-transition.png', { fullPage: false });
