// NDC-2729 r12: AEX-01_Deals designer → NeedsAnalysisToProposal → After → Create task / meeting / call: module picker, owner, dropdown defaults, Related record. Nothing saved.
const st = {};
await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 80; i++) { await sleep(3000); if ((await text()).includes('NeedsAnalysisToProposal')) break; } await sleep(3000); await shot('2729-a0-designer.png');
await page.getByText('NeedsAnalysisToProposal', { exact: false }).first().click(); await sleep(3000);
const tabs = await page.getByRole('tab').allInnerTexts(); st.tabs = tabs;
await page.getByRole('tab', { name: 'After' }).click(); await sleep(2000); await shot('2729-a1-after.png');
st.afterButtons = (await page.getByRole('button').allInnerTexts()).map(x => x.trim()).filter(x => /^Create|Add|Send|Update|Webhook|Function/i.test(x));
const read = async (tag) => { const panel = page.locator('aside, [role=dialog], [data-panel]').last();
  const sel = await page.locator('select:visible').evaluateAll(a => a.map(s => { const lab = (s.closest('label, div') || {}).innerText || ''; return { label: lab.split('\n')[0].slice(0, 30), shown: s.options[s.selectedIndex] ? s.options[s.selectedIndex].text : '', first: [...s.options].filter(o => !o.disabled && o.value !== '').map(o => o.text)[0], opts: [...s.options].map(o => o.text).slice(0, 8).join('/') }; }));
  const combos = await page.locator('button[role=combobox]:visible, [aria-haspopup=listbox]:visible').evaluateAll(a => a.map(b => { const l = b.getAttribute('aria-label') || (b.closest('div') && b.closest('div').previousElementSibling ? b.closest('div').previousElementSibling.innerText : ''); return (l || '').slice(0, 30) + ' = ' + b.innerText.trim().slice(0, 40); }));
  const inputs = await page.locator('input:visible').evaluateAll(a => a.map(i => (i.getAttribute('aria-label') || i.placeholder || i.name || '') + ' = ' + i.value).filter(x => x.length > 3));
  return { sel, combos, inputs }; };
for (const a of ['Create task', 'Create meeting', 'Create call']) {
  const b = page.getByRole('button', { name: a, exact: true }); if (!(await b.count())) { st[a] = 'no button'; continue; }
  await b.click(); await sleep(3000); await shot(`2729-a-${a.replace(/\s+/g, '-')}.png`); await page.mouse.wheel(0, 600); await sleep(800); await shot(`2729-a-${a.replace(/\s+/g, '-')}-2.png`);
  st[a] = await read(a);
  const cancel = page.getByRole('button', { name: /^(Cancel|Back|Close)$/ }); if (await cancel.count()) { await cancel.last().click(); await sleep(1500); } else await page.keyboard.press('Escape');
  await sleep(1000); if (!(await page.getByRole('button', { name: 'Create meeting', exact: true }).count())) { await page.getByRole('tab', { name: 'After' }).click().catch(() => {}); await sleep(1500); }
}
return st;
