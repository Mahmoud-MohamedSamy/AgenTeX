const res = {};
const pop = async () => page.evaluate(() => [...document.querySelectorAll('[role=dialog], [role=menu], [role=listbox], [data-radix-popper-content-wrapper]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || ').slice(0, 700));
await page.locator('main input[placeholder="Untitled Teamspace"]').fill('QA R2W5 TS');
await page.locator('button[aria-label="Change teamspace icon"]').click(); await sleep(1200); res.icon = await pop(); await shot('c12-1678-icon'); await page.keyboard.press('Escape'); await sleep(500);
await page.locator('button[aria-label="Change teamspace admin"]').click(); await sleep(1200); res.admin = await pop(); await shot('c12-1678-admin'); await page.keyboard.press('Escape'); await sleep(500);
await page.locator('main button', { hasText: /^Create Folder$/ }).click(); await sleep(1200); res.folderDlg = await pop(); await shot('c12-folder');
return res;
