await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('input,textarea')).length > 4) break; }
await page.getByPlaceholder('name@example.com').fill('qa.rt15@example.com');
const subj = page.getByPlaceholder('Type or pick a subject'); await subj.fill('QA RT15 2205 form'); await page.keyboard.press('Escape'); await sleep(500);
const pick = async (label, opt) => { const lab = page.getByText(label, {exact:true}).first(); const btn = lab.locator('xpath=following::button[normalize-space(.)="Select"][1]'); await btn.click(); await sleep(1200); const o = page.getByRole('option', {name: opt, exact:true}); if (await o.count()) await o.first().click(); else { const any = page.locator('[role=listbox] *, [role=menu] *', {hasText: opt}).first(); log('opts', (await page.locator('[role=listbox], [role=menu], [cmdk-list]').first().innerText().catch(()=>'none')).slice(0,300)); await any.click(); } await sleep(800); };
await pick('*Status', 'Open').catch(async e => { log('statusErr', String(e).slice(0,200)); });
await pick('Priority', 'High').catch(async e => { log('prioErr', String(e).slice(0,200)); });
await shot('2205-form-filled.png');
await page.getByRole('button', {name:'Save', exact:true}).click(); await sleep(8000); log(page.url()); await shot('2205-form-saved.png');
