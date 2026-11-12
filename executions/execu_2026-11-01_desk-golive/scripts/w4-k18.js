const G = []; const onG = r => { if (r.url().includes('/api/v1/') && r.status() >= 400) G.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(API, '').slice(0, 120)); }; page.on('response', onG);
await go('/knowledge-base/gallery', 20000);
out.g1 = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 300);
await sleep(15000); out.g2 = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 300);
out.imgs = await page.locator('main img').count();
await shot('w4/W4-66-gallery-loading');
await go('/knowledge-base/articles/new', 10000);
await page.getByRole('button', { name: /^Start from template/ }).click(); await sleep(2000);
await page.getByText('QA GL W4 tpl', { exact: true }).last().click(); await sleep(3000);
const d = page.locator('[role=dialog]').last(); if (await d.count()) { out.applyDlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 200); await d.getByRole('button', { name: /^(Use|Apply|Replace|Continue)/ }).last().click().catch(() => {}); await sleep(2000); }
out.body = (await page.locator('[aria-label="Article content"]').first().innerText()).replace(/\s+/g, ' ').slice(0, 200);
out.err = G.slice(0, 10); page.off('response', onG);
return fin({ out });
