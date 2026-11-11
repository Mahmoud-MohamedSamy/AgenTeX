await page.goto(H + '/settings/automation/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/Move to On Hold/i.test(await text())) break; }
await page.getByText('Move to On Hold', {exact:true}).first().click(); await sleep(3000);
// Department control in Create task
const dep = page.locator('label,div').filter({ hasText: /^Department\*/ }).last();
const info = await page.evaluate(() => { const out=[]; document.querySelectorAll('label, span, div').forEach(el => { if (/^(Department\*?|Team)$/.test((el.childNodes[0]&&el.childNodes[0].textContent||'').trim())) { const box = el.closest('div'); const c = box && box.parentElement && box.parentElement.querySelector('input,select,button[aria-haspopup],[role=combobox]'); if (c) out.push({ label: el.textContent.trim().slice(0,30), tag: c.tagName, type: c.type, ph: c.getAttribute('placeholder'), role: c.getAttribute('role'), txt: (c.innerText||c.value||'').slice(0,40) }); } }); return out; });
log('dept/team controls', info);
const di = page.getByText('Department*', {exact:false}).last(); await di.scrollIntoViewIfNeeded(); await sleep(800);
await shot('2729-desk-createtask-dept.png');
// Field update: pick Status in the field select
const fsel = page.locator('select', { has: page.locator('option', { hasText: 'Response Due Date' }) }).first();
await fsel.selectOption({ label: 'Status' }); await sleep(1500);
const after = await fsel.evaluate(s => { const card = s.parentElement.parentElement; const v = card.querySelectorAll('select,input,button[aria-haspopup]'); return [...v].map(c => ({ tag: c.tagName, sel: c.tagName==='SELECT' ? c.options[c.selectedIndex].text : (c.value||c.innerText), opts: c.tagName==='SELECT' ? [...c.options].map(o=>o.text).slice(0,6) : null })); });
log('field update after Status', after);
await fsel.scrollIntoViewIfNeeded(); await shot('2729-desk-fieldupdate-status.png');
// try Department as field update target
await fsel.selectOption({ label: 'Department' }); await sleep(1500);
log('field update Department', await fsel.evaluate(s => { const card = s.parentElement.parentElement; return [...card.querySelectorAll('select,input,button[aria-haspopup]')].map(c => ({ tag: c.tagName, type:c.type, ph:c.getAttribute('placeholder'), sel: c.tagName==='SELECT' ? c.options[c.selectedIndex].text : (c.value||c.innerText), opts: c.tagName==='SELECT' ? [...c.options].map(o=>o.text).slice(0,6) : null })); }));
await shot('2729-desk-fieldupdate-dept.png');
