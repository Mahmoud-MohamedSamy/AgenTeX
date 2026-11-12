// W5-23 HQ department switch
await go('/hq', 9000); out.hq = (await mtxt()).slice(0, 250);
const dsel = page.getByRole('combobox').first(); out.hqDept = await dsel.innerText().catch(() => '?');
// W5-24 add component (look only at the picker, then add one and remove)
await page.getByRole('button', { name: /Add Component/i }).click().catch(e => out.acErr = e.message.slice(0, 60)); await sleep(3000);
out.acDlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); await shot('w5/W5-24-add-component');
await page.keyboard.press('Escape'); await sleep(1000);
// W5-25 reports builder
await go('/analytics/reports', 9000);
await page.getByRole('button', { name: /Add Report/i }).first().click().catch(e => out.arErr = e.message.slice(0, 60)); await sleep(5000);
out.builderUrl = page.url().replace(H, ''); out.builder = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 1200); await shot('w5/W5-25-report-builder');
return fin({ out });
