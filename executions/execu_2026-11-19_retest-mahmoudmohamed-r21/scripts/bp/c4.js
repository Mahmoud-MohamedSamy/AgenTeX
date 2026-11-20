const out = {};
for (const m of ['Tasks', 'Meetings', 'Calls']) {
await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(2500);
await page.getByRole('tab', { name: /Transition/i }).first().click().catch(() => {}); await sleep(1200);
await page.getByText('After', { exact: true }).first().click(); await sleep(2000);
await page.locator('button', { hasText: /^\s*Create record\s*$/ }).first().click(); await sleep(2000);
await page.locator('select', { has: page.locator('option', { hasText: 'Subscriptions' }) }).last().selectOption({ label: m }); await sleep(3000);
out[m] = await page.evaluate(() => { const hs = [...document.querySelectorAll('div,span,p')].filter(e => e.childElementCount === 0 && e.textContent.trim() === 'Create record' && e.getBoundingClientRect().x > 1150); let c = hs[hs.length - 1]; for (let i = 0; i < 8 && c; i++) { c = c.parentElement; if (c.querySelectorAll('select,input').length > 4) break; }
  const t = c.innerText.replace(/\s+/g, ' '); const sels = [...c.querySelectorAll('select')].slice(1).map(x => ({ v: (x.options[x.selectedIndex] || {}).text, first: (x.options[0] || {}).text }));
  const ph = [...c.querySelectorAll('input')].map(x => x.getAttribute('placeholder')).filter(Boolean);
  return { head: t.slice(0, 260), owners: t.match(/\b[A-Z][a-z]+ Owner\b/g) || [], notFirst: sels.filter(x => x.v !== x.first).map(x => x.v), valuePh: ph.filter(p => /^Value$/i.test(p)).length, selectPh: (t.match(/Select…/g) || []).length, chooseRec: (t.match(/Choose a record/g) || []).length, related: (t.match(/Related record.{0,20}/) || [''])[0] }; });
}
return out;
