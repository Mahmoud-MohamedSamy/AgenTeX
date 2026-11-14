await page.goto(H + '/modules/f7e488b5-0232-42fd-811c-1f24356af653/records/788fe81c-0421-4c48-bd70-d99af6ec0337', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA RT17 2635 call/.test(await text())) break; } await sleep(3000);
const btns = await page.$$eval('main button, [role=main] button', bs => bs.map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(Boolean));
log('call page buttons', [...new Set(btns)].filter(b => /Delete|Complete|timer|Edit/i.test(b))); await shot('2635-call-page.png');
