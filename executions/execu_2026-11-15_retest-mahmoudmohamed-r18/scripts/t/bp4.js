await page.goto(H + '/settings/automation/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/Escalate Ticket/i.test(await text())) break; }
await page.getByText('Escalate Ticket', {exact:true}).first().click(); await sleep(3000);
await page.getByRole('button', { name: 'Field update', exact: true }).first().click(); await sleep(2000);
const fsel = page.locator('select', { has: page.locator('option', { hasText: 'Response Due Date' }) }).last();
const all = await fsel.evaluate(s=>[...s.options].map(o=>o.text));
const banned = all.filter(x=>/^(Status|Department|Team|Skills|Priority|Classification|Channel|Category|Language)$/i.test(x));
const dump = async () => fsel.evaluate(s => { const card = s.closest('div').parentElement; return [...card.querySelectorAll('select,input,button[aria-haspopup],[role=combobox]')].filter(c=>c!==s).map(c => ({ tag: c.tagName, type:c.type, ph:c.getAttribute('placeholder'), sel: c.tagName==='SELECT' ? c.options[c.selectedIndex].text : (c.value||c.innerText), opts: c.tagName==='SELECT' ? [...c.options].map(o=>o.text).slice(0,10) : null })); });
const res={};
for (const f of all.filter(x=>/Ticket Owner|Due Date|Checkbox Displayed|QA NDC Reason Of memo|QA NDC Rejection Reasons|QA NDC 5-Transfer Reason|QA NDC Escalation owner/.test(x)).slice(0,7)) { await fsel.selectOption({ label: f }); await sleep(1200); res[f]=await dump(); }
await fsel.selectOption({ label: 'Ticket Owner' }); await sleep(1000); await fsel.scrollIntoViewIfNeeded(); await shot('2729-4-desk-fu-owner.png');
return {n:all.length, banned, all:all.join(' | ').slice(0,3000), res};
