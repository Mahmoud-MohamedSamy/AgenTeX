const out = {};
await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(2500);
await page.getByRole('tab', { name: /Transition/i }).first().click().catch(() => {}); await sleep(1200);
await page.getByText('After', { exact: true }).first().click(); await sleep(2000);
await page.locator('button', { hasText: /^\s*Create record\s*$/ }).first().click(); await sleep(2000);
const sel = page.locator('select', { has: page.locator('option', { hasText: 'Subscriptions' }) }).last();
for (const m of ['Tasks', 'Meetings', 'Transactions']) {
  await sel.selectOption({ label: m }); await sleep(2500);
  out[m] = await sel.evaluate(s => { let c = s; for (let i = 0; i < 6; i++) { c = c.parentElement; if (c.querySelectorAll('select,input').length > 4) break; } const t = c.innerText.replace(/\s+/g, ' ');
    const sels = [...c.querySelectorAll('select')].slice(1).map(x => ({ v: (x.options[x.selectedIndex] || {}).text, first: (x.options[0] || {}).text }));
    const inputs = [...c.querySelectorAll('input[type=text],input:not([type])')].map(x => x.getAttribute('placeholder')).filter(Boolean);
    return { t: t.slice(0, 700), owners: (t.match(/\b[A-Z][a-z]+ Owner\b/g) || []), assign: /ASSIGN TO/.test(t), notFirst: sels.filter(x => x.v !== x.first), valuePh: inputs.filter(p => /^Value$/i.test(p)).length, chooseRec: (t.match(/Choose a record/g) || []).length }; });
  if (m === 'Tasks') { await sel.scrollIntoViewIfNeeded(); await sleep(500); await shot('2729-5-crm-create-record-tasks.png'); }
}
return out;
