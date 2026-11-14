await page.goto(H + '/settings/automation/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/Escalate Ticket/i.test(await text())) break; }
await page.getByText('Escalate Ticket', {exact:true}).first().click(); await sleep(3000);
const nBefore = await page.locator('select').count();
await page.getByRole('button', { name: 'Field update', exact: true }).first().click(); await sleep(1500);
const fsel = page.locator('select', { has: page.locator('option', { hasText: 'Response Due Date' }) }).last();
const dump = async () => fsel.evaluate(s => { const card = s.closest('div').parentElement; return [...card.querySelectorAll('select,input,button[aria-haspopup]')].map(c => ({ tag: c.tagName, type:c.type, ph:c.getAttribute('placeholder'), sel: c.tagName==='SELECT' ? c.options[c.selectedIndex].text : (c.value||c.innerText), opts: c.tagName==='SELECT' ? [...c.options].map(o=>o.text).slice(0,12) : null })); });
const res = {};
for (const f of ['Status','Department','Team','Ticket Owner','Due Date','Skills']) { await fsel.selectOption({ label: f }); await sleep(1200); res[f] = await dump(); if (f==='Status'||f==='Department') { await fsel.scrollIntoViewIfNeeded(); await shot('2729-desk-newFU-'+f+'.png'); } }
log(res);
// new Create task
await page.getByRole('button', { name: 'Create task', exact: true }).first().click(); await sleep(1500);
const ct = page.getByText('Department', { exact: false }).last(); await ct.scrollIntoViewIfNeeded(); await sleep(500);
const ctinfo = await page.evaluate(() => { const r=[]; document.querySelectorAll('label').forEach(l => { const t=l.innerText.trim(); if (/^(Department|Team|Status|Priority|Category)/.test(t)) { const c = l.parentElement.querySelector('input,select,button[aria-haspopup],[role=combobox]'); r.push({ t: t.slice(0,25), tag: c&&c.tagName, type: c&&c.type, ph: c&&c.getAttribute('placeholder'), v: c && (c.tagName==='SELECT'? c.options[c.selectedIndex].text : (c.value||c.innerText)) }); } }); return r; });
log('createtask', ctinfo); await shot('2729-desk-newCT-dept.png');
