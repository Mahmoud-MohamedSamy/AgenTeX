await page.goto(H + '/settings/automation/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/Escalate Ticket/i.test(await text())) break; }
await page.getByText('Escalate Ticket', {exact:true}).first().click(); await sleep(3000);
await page.getByRole('button', { name: 'Field update', exact: true }).first().click(); await sleep(2000);
const fsel = page.locator('select', { has: page.locator('option', { hasText: 'Response Due Date' }) }).last();
const all = await fsel.evaluate(s=>[...s.options].map(o=>o.text));
const pick = all.filter(x=>/^(Priority|Channel|Classification|Category|Sub Category|Language|Status|Department|Team|Skills)$/i.test(x) || /^QA NDC/.test(x));
const dump = async () => fsel.evaluate(s => { const card = s.closest('div').parentElement; return [...card.querySelectorAll('select,input,button[aria-haspopup],[role=combobox]')].filter(c=>c!==s).map(c => ({ tag: c.tagName, ph:c.getAttribute('placeholder'), sel: c.tagName==='SELECT' ? c.options[c.selectedIndex].text : (c.value||c.innerText), opts: c.tagName==='SELECT' ? [...c.options].map(o=>o.text).slice(0,8).join(' | ') : null })); });
const res = {};
for (const f of ['Priority','Channel','Classification','Category','Language'].filter(x=>all.includes(x)).concat(all.filter(x=>/^QA NDC/.test(x)).slice(0,2))) { await fsel.selectOption({ label: f }); await sleep(1200); res[f] = await dump(); }
if (all.includes('Priority')) { await fsel.selectOption({ label: 'Priority' }); await sleep(1000); }
await fsel.scrollIntoViewIfNeeded(); await sleep(500); await shot('2729-6-desk-fu-priority.png');
const v = fsel.locator('xpath=following::select[1]'); if (await v.count()) { await v.click().catch(()=>{}); }
return { n: all.length, pickOffered: pick, banned: all.filter(x=>/^(Status|Department|Team|Skills)$/i.test(x)), res };
