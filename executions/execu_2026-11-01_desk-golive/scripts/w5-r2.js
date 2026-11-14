// W5-24 add one component, then remove it; W5-26 builder probe
await go('/hq', 9000);
out.before = await page.locator('main h2, main h3').allInnerTexts().catch(() => []);
await page.getByRole('button', { name: /Add Component/i }).click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').last();
const card = dlg.getByText(/^Online agents$/).first(); await card.click().catch(e => out.cardErr = e.message.slice(0, 80)); await sleep(1500);
out.dlgBtns = await dlg.getByRole('button').allInnerTexts().catch(() => []);
const add = dlg.getByRole('button', { name: /^(Add|Add Component|Save|Done)$/i }).last(); if (await add.count()) { await add.click(); await sleep(4000); } else { out.noAddBtn = true; }
out.after = await page.locator('main h2, main h3').allInnerTexts().catch(() => []);
await shot('w5/W5-24-added');
await go('/analytics/reports/builder', 9000);
out.builderHtml = (await page.locator('body').innerHTML()).match(/Select a dataset[\s\S]{0,0}/) ? 'has text' : 'no text';
out.combos = await page.getByRole('combobox').evaluateAll(es => es.map(e => e.outerHTML.slice(0, 200)));
out.selects = await page.locator('select').evaluateAll(es => es.map(e => e.outerHTML.slice(0, 300)));
out.inputs = await page.locator('input').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.placeholder || e.name || e.id)));
return fin({ out });
