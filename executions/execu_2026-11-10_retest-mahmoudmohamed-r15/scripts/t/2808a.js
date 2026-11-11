await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('input,textarea')).length > 4) break; } await sleep(2000);
const labels = ['*Status','Channel','Language','Classification','Category','Sub Category','Priority'];
const read = async () => {
  const o = {};
  for (const l of labels) { const lab = page.getByText(l, {exact:true}).first(); if (!(await lab.count())) { o[l]='(no label)'; continue; } const b = lab.locator('xpath=following::button[1]'); o[l] = (await b.innerText().catch(()=>'?')).replace(/\s+/g,' ').trim(); }
  o.Description = await page.locator('textarea').first().inputValue().catch(()=>'?');
  o.Subject = await page.getByPlaceholder('Type or pick a subject').inputValue().catch(()=>'?');
  const sel = page.locator('select').filter({ has: page.locator('option', { hasText: 'Standard Template' }) }).first();
  o.dropdown = await sel.evaluate(s => s.options[s.selectedIndex].text).catch(()=>'?');
  o.toast = await page.$$eval('[data-sonner-toast]', ts => ts.map(t=>t.innerText.trim()).join(' | '));
  return o;
};
const sel = page.locator('select').filter({ has: page.locator('option', { hasText: 'Standard Template' }) }).first();
log('options', await sel.evaluate(s => [...s.options].map(o=>o.text)));
await page.getByPlaceholder('Type or pick a subject').fill('QA RT15 2808 typed by agent'); await page.keyboard.press('Escape');
await page.getByPlaceholder('name@example.com').fill('qa.rt15@example.com');
log('0 start', await read());
const pick = async (re) => { const opt = await sel.evaluate((s, src) => { const r = new RegExp(src); const o = [...s.options].find(x => r.test(x.text)); return o && o.value; }, re.source); await sel.selectOption(opt); await sleep(2500); };
await pick(/^test template/); log('1 test template', await read()); await shot('2808-1-test-template.png'); await sleep(6000); log('1b after toast gone', (await read()).dropdown); await shot('2802-dropdown-after-toast.png');
await pick(/^Standard Template/); log('2 Standard Template', await read()); await shot('2808-2-standard-template.png');
log('options after pick', await sel.evaluate(s => [...s.options].map(o=>o.text+'='+o.value))); const clr = page.locator('button[aria-label*="lear" i]').filter({hasNot: page.locator('svg[data-x]')}); log('clear buttons', await page.$$eval('button[aria-label]', bs => bs.map(b=>b.getAttribute('aria-label')).filter(a=>/clear|remove|template/i.test(a)))); const opt0 = await sel.evaluate(s => s.options[0].value); await sel.selectOption(opt0).catch(e=>log('sel0err', String(e).slice(0,100))); await sleep(2500); log('3 after first option', await read()); await shot('2808-3-no-template.png');
