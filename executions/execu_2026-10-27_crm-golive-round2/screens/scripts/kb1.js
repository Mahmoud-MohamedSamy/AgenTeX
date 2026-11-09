const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(B + '/modules/' + D, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelectorAll('tbody tr td').length > 3, null, { timeout: 90000 });
await page.click('[title="Kanban view"], [aria-label="Kanban view"]'); await sleep(2000);
await page.locator('[role=dialog] input').first().fill('QA R2SC KB');
await page.locator('[role=dialog] button:has-text("Save")').click(); await sleep(6000);
out.url = page.url().replace(B, '');
out.cards = await page.$$eval('[draggable=true], [data-rbd-draggable-id], [data-card-id]', es => es.length);
await page.screenshot({ path: RAW + 'kanban-qa-view.png' });
