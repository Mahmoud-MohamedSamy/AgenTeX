await page.goto(H + '/settings/automation/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/Escalate Ticket/i.test(await text())) break; }
await page.getByText('Escalate Ticket', {exact:true}).first().click(); await sleep(3000);
await page.getByRole('button', { name: 'Field update', exact: true }).first().click(); await sleep(2000);
const fsel = page.locator('select', { has: page.locator('option', { hasText: 'Response Due Date' }) }).last();
await fsel.selectOption({ label: 'Checkbox Displayed by Layout Rules' }); await sleep(1200);
const cb = await fsel.evaluate(s => { const card = s.closest('div').parentElement; return [...card.querySelectorAll('select,input,button[aria-haspopup],[role=combobox],[role=switch]')].filter(c=>c!==s).map(c => ({ tag: c.tagName, type:c.type, ph:c.getAttribute('placeholder'), sel: c.tagName==='SELECT' ? c.options[c.selectedIndex].text : (c.value||c.innerText), opts: c.tagName==='SELECT' ? [...c.options].map(o=>o.text).slice(0,10) : null })); });
await fsel.scrollIntoViewIfNeeded(); await shot('2729-5-desk-fu-checkbox.png');
await page.getByRole('button', { name: 'Create task', exact: true }).first().click(); await sleep(2000);
const ctinfo = await page.evaluate(() => { const r=[]; document.querySelectorAll('label').forEach(l => { const t=l.innerText.trim(); const c = l.parentElement.querySelector('input,select,button[aria-haspopup],[role=combobox],textarea'); if(c && c.getBoundingClientRect().height>0) r.push({ t: t.slice(0,30), tag: c.tagName, type: c.type, ph: c.getAttribute('placeholder'), v: c.tagName==='SELECT'? c.options[c.selectedIndex].text+' ['+[...c.options].map(o=>o.text).slice(0,8).join(',')+']' : (c.value||c.innerText).slice(0,40) }); }); return r; });
const tx=await text(); const k=tx.lastIndexOf('Create task'); 
const sub=page.getByText('Subject', {exact:false}).last(); await sub.scrollIntoViewIfNeeded().catch(()=>{}); await sleep(600); await shot('2729-6-desk-ct-top.png');
await page.mouse.move(1380,600); await page.mouse.wheel(0,400); await sleep(800); await shot('2729-7-desk-ct-bottom.png');
return {cb, ctinfo: ctinfo.slice(-16), ctText: tx.slice(k, k+900)};
