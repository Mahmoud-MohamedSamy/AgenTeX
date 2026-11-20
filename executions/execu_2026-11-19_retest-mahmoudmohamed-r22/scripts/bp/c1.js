const out = {};
await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(3000);
await page.getByRole('tab', { name: /Transition/i }).first().click().catch(() => {}); await sleep(1500);
await page.getByText('After', { exact: true }).first().click(); await sleep(2500);
out.afterButtons = (await page.getByRole('button').allInnerTexts()).map(x => x.trim()).filter(x => /^(Create|Task|Meeting|Call|Field|Email|Webhook|Function|Record|Add)/i.test(x)).slice(0, 20);
await shot('2729-0-crm-after-buttons.png');
return out;
