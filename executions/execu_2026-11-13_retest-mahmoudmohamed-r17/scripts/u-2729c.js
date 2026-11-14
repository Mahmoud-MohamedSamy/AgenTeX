await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(3000);
await page.getByRole('tab', { name: /Transition/i }).first().click().catch(()=>{}); await sleep(1500);
await page.getByText('After', { exact: true }).first().click(); await sleep(2500);
await page.getByRole('button', { name: 'Create task', exact: true }).first().click(); await sleep(2500);
const assign = page.getByText('ASSIGN TO').last(); await assign.scrollIntoViewIfNeeded(); await sleep(800); await shot('2729-crm-task-top.png');
const rem = page.getByText('Reminder', {exact:true}).last(); await rem.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 120); await sleep(800); await shot('2729-crm-task-defaults.png');
await page.getByRole('button', { name: 'Call', exact: true }).first().click(); await sleep(2500);
const ct = page.getByText('Call Type*').last(); await ct.scrollIntoViewIfNeeded(); await sleep(800); await shot('2729-crm-call-defaults.png');
const info = await page.evaluate(() => { const r=[]; document.querySelectorAll('label').forEach(l => { const t=l.innerText.trim(); if (/^(Reminder|Status|Priority|Call Type|Call Status|Call Purpose|Call Result|Module|Task Owner|Related record)/i.test(t)) { const c = l.parentElement.querySelector('input,select,button[aria-haspopup],[role=combobox]'); r.push({ t: t.split('\n')[0].slice(0,25), tag: c&&c.tagName, v: c && (c.tagName==='SELECT'? c.options[c.selectedIndex].text : (c.value||c.innerText)).slice(0,40) }); } }); return r; });
log('crm fields', info); const tx=await text(); log('has module picker text', /Module\s*\n\s*Tasks/.test(tx), 'Task Owner', /Task Owner/.test(tx), 'ASSIGN TO', /ASSIGN TO/i.test(tx));
