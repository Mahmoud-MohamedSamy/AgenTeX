// NDC-2729 r12 part C: add Meeting / Call / Create task actions (unsaved) and read only the new card's controls. Leaves with Cancel.
const st = {};
await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 80; i++) { await sleep(3000); if ((await text()).includes('NeedsAnalysisToProposal')) break; } await sleep(3000);
await page.getByText('NeedsAnalysisToProposal', { exact: false }).first().click(); await sleep(3000);
await page.getByRole('tab', { name: 'After' }).click(); await sleep(2000);
const all = () => page.locator('select:visible, input:visible, button:visible');
const snap = () => page.evaluate(() => [...document.querySelectorAll('select, input, button, [role=combobox]')].filter(e => e.offsetParent).map((e, i) => { e.dataset.qa = e.dataset.qa || ('q' + Math.random().toString(36).slice(2)); return e.dataset.qa; }));
for (const a of ['Create task', 'Meeting', 'Call']) {
  const before = new Set(await snap());
  await page.getByRole('button', { name: a, exact: true }).click(); await sleep(3000);
  const after = await snap(); const fresh = after.filter(x => !before.has(x));
  st[a] = await page.evaluate(ids => ids.map(id => { const e = document.querySelector(`[data-qa="${id}"]`); const lab = (() => { let p = e; for (let k = 0; k < 4 && p; k++) { p = p.parentElement; const l = p && p.querySelector('label, span, p'); if (l && l.innerText.trim() && !l.contains(e)) return l.innerText.trim().split('\n')[0]; } return ''; })();
    if (e.tagName === 'SELECT') return `SELECT [${lab.slice(0, 28)}] shown="${e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : ''}" opts=${[...e.options].map(o => o.text).slice(0, 7).join('/')}`;
    if (e.tagName === 'INPUT') return `INPUT [${lab.slice(0, 28)}] type=${e.type} ph="${e.placeholder}" val="${e.value}"`;
    return `${e.tagName} [${lab.slice(0, 28)}] "${(e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)}"`; }), fresh);
  const first = page.locator(`[data-qa="${fresh[0]}"]`); await first.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); await shot(`2729-c-${a.replace(/\s+/g, '-')}.png`);
}
st.footer = ((await text()).match(/Fill every required[^\n]*/) || [''])[0];
await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(2500);
const disc = page.getByRole('button', { name: /Discard|Leave|Yes/ }); if (await disc.count()) { await disc.first().click(); await sleep(2000); }
st.leftUrl = page.url(); return st;
