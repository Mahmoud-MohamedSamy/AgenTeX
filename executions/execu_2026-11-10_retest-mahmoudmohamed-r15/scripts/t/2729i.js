await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(3000);
await page.getByRole('tab', { name: /Transition/i }).first().click().catch(()=>{}); await sleep(1500);
await page.getByText('After', { exact: true }).first().click(); await sleep(2500);
await page.getByRole('button', { name: 'Field update', exact: true }).first().click(); await sleep(1500);
const fsel = page.locator('select', { has: page.locator('option', { hasText: 'Campaign Source' }) }).last();
const opts = await fsel.evaluate(s => [...s.options].map(o => o.text)); log('fields', opts);
const dump = async () => fsel.evaluate(s => { const card = s.closest('div').parentElement; return [...card.querySelectorAll('select,input,button[aria-haspopup]')].map(c => ({ tag: c.tagName, type:c.type, ph:c.getAttribute('placeholder'), sel: c.tagName==='SELECT' ? c.options[c.selectedIndex].text : (c.value||c.innerText), opts: c.tagName==='SELECT' ? [...c.options].map(o=>o.text).slice(0,6) : null })); });
const res = {};
for (const f of opts.filter(o => /Stage|Type|Source|Lead|Owner|Pipeline|Reason|Branch|Country/i.test(o)).slice(0,8)) { await fsel.selectOption({ label: f }); await sleep(1000); res[f] = (await dump()).slice(2); }
log(res); await fsel.scrollIntoViewIfNeeded(); await shot('2729-crm-newFU.png');
