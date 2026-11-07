const st = {};
await page.setViewportSize({ width: 1600, height: 1400 });
await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 80; i++) { await sleep(3000); if ((await text()).includes('NeedsAnalysisToProposal')) break; } await sleep(3000);
await page.getByText('NeedsAnalysisToProposal', { exact: false }).first().click(); await sleep(3000);
await page.getByRole('tab', { name: 'After' }).click(); await sleep(2000);
for (const a of ['Create task', 'Meeting', 'Call']) {
  await page.getByRole('button', { name: a, exact: true }).click(); await sleep(5000);
  const card = page.getByRole('button', { name: 'Remove action' }).last().locator('xpath=ancestor::div[.//input][1]');
  await card.scrollIntoViewIfNeeded(); await sleep(800);
  await card.screenshot({ path: require('path').join(process.cwd(), '..', 'screenshots', 'raw', `2729-d-${a.replace(/\s+/g, '-')}-card.png`) });
  st[a] = (await card.innerText()).replace(/\n+/g, ' | ').slice(0, 1500);
  st[a + '_users'] = await card.getByRole('button', { name: 'Choose a user…' }).evaluateAll(bs => bs.map(b => { let p = b; for (let k = 0; k < 5; k++) { p = p.parentElement; const t = p.innerText.split('\n')[0]; if (t && t !== 'Choose a user…') return t; } return '?'; }));
  st[a + '_selects'] = await card.locator('select').evaluateAll(a => a.map(s => { let p = s; let l = ''; for (let k = 0; k < 4 && !l; k++) { p = p.parentElement; const x = p.querySelector('label'); if (x) l = x.innerText.trim(); } return l + ': ' + (s.options[s.selectedIndex] || {}).text + ' (first ' + s.options[0].text + ')'; }));
}
await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(2000);
const disc = page.getByRole('button', { name: /Discard|Leave|Yes/ }); if (await disc.count()) { await disc.first().click(); await sleep(2000); }
return st;
