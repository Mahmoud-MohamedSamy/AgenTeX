const out = {};
await page.getByRole('button', { name: 'Field Changed', exact: true }).click(); await sleep(1500);
const t = await txt(); out.when = t.slice(t.indexOf('EXECUTE BASED ON'), t.indexOf('RULE MODE'));
await page.getByRole('button', { name: 'Edit conditions' }).click().catch(() => {}); await sleep(800);
await page.getByRole('radio', { name: /Tickets matching certain conditions/ }).click(); await sleep(800);
if (!(await page.getByRole('button', { name: '— select field —' }).count())) { await page.getByRole('button', { name: 'Add condition' }).first().click(); await sleep(800); }
await page.getByRole('button', { name: '— select field —' }).first().click(); await sleep(800);
await page.getByRole('option', { name: 'Priority', exact: true }).click(); await sleep(800);
await page.getByRole('button', { name: 'Operator' }).first().click(); await sleep(800);
out.ops = await page.getByRole('option').allInnerTexts();
await page.keyboard.press('Escape');
return done(out);
