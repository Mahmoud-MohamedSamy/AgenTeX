const id = fs.readFileSync(RUN + '/out/h1-url.txt', 'utf8').trim().split('/').pop();
await page.goto(H + `/modules/${made.mod}/records/${id}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA FX UI DOUBLE/i.test(await text('main'))) break; }
await page.getByRole('button', { name: /Send Email/ }).first().click(); await sleep(4000);
const dlg = page.locator('[role=dialog]').last(); const subj = dlg.getByPlaceholder(/subject/i).first(); if (await subj.count()) await subj.fill('QA FX I9 merge test'); else log('no subject box');
const ed = dlg.locator('[contenteditable=true]').first(); await ed.click(); await page.keyboard.insertText('Double={{qa_fx_ui_double}} Num={{qa_num}} Name={{name}}'); await sleep(500);
await dlg.getByRole('button', { name: 'Preview' }).click(); await sleep(3000); await shot('I9-preview');
const pv = (await page.locator('[role=dialog]').allInnerTexts()).join(' || '); const m = pv.match(/Double=[^\n|]*/); log('preview', m ? m[0] : pv.slice(0, 400).replace(/\n+/g, ' | '));
const back = page.getByRole('button', { name: /Back|Edit|Close preview/i }).first(); if (await back.count()) { await back.click(); await sleep(1000); }
const send = page.locator('[role=dialog] button').filter({ hasText: /^Send$/ }).last(); await send.click(); await sleep(6000); await shot('I9-sent');
log('after send', (await page.locator('[data-sonner-toast], li[role=status], [role=alert]').allInnerTexts()).join(' || ').slice(0, 300));
