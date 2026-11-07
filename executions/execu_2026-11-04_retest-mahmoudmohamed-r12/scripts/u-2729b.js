// NDC-2729 r12 part B: Create record action → module picker; pick Meetings and Calls, read defaults. Nothing saved.
const st = {};
await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 80; i++) { await sleep(3000); if ((await text()).includes('NeedsAnalysisToProposal')) break; } await sleep(3000);
await page.getByText('NeedsAnalysisToProposal', { exact: false }).first().click(); await sleep(3000);
await page.getByRole('tab', { name: 'After' }).click(); await sleep(2000);
await page.getByRole('button', { name: 'Create record', exact: true }).click(); await sleep(3000); await shot('2729-b0-create-record.png');
const sels = () => page.locator('select:visible').evaluateAll(a => a.map(s => { const lab = (s.closest('label, div') || {}).innerText || ''; return { label: lab.split('\n')[0].slice(0, 30), shown: s.options[s.selectedIndex] ? s.options[s.selectedIndex].text : '', first: [...s.options].filter(o => !o.disabled && o.value !== '').map(o => o.text)[0], opts: [...s.options].map(o => o.text).slice(0, 12).join('/') }; }));
st.initial = await sels();
const modSel = page.locator('select:visible').filter({ hasText: /Meetings/ }).first(); st.modOpts = await modSel.evaluate(s => [...s.options].map(o => o.text));
for (const m of ['Meetings', 'Calls']) { await modSel.selectOption({ label: m }); await sleep(3000); await shot(`2729-b-${m}.png`); await page.mouse.wheel(0, 500); await sleep(600); await shot(`2729-b-${m}-2.png`);
  st[m] = { sels: await sels(), inputs: await page.locator('input:visible').evaluateAll(a => a.map(i => (i.getAttribute('aria-label') || i.placeholder || '') + '=' + i.value)), buttons: (await page.getByRole('button').allInnerTexts()).map(x => x.trim()).filter(x => /Choose|user|Select/i.test(x)) }; }
return st;
