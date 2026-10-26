const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', ID = '5712b381-59ee-4cb4-b025-b7a834d74d86';
const idx = await page.evaluate(() => [...document.querySelectorAll('thead th')].findIndex(t => t.innerText.trim() === 'Pipeline'));
const row = page.locator('tbody tr').filter({ hasText: 'QA RT 1302 move' }).first();
const cell = row.locator('td').nth(idx); await cell.scrollIntoViewIfNeeded(); await cell.hover(); await sleep(500);
const cellText = await cell.innerText();
await cell.dblclick().catch(() => {}); await sleep(1200);
let edit = await page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.slice(0, 300) || [...document.querySelectorAll('[role=option],[role=listbox] *')].map(e => e.innerText.trim()).filter(Boolean).slice(0, 8).join(' | '));
if (!edit) { const pen = cell.locator('button').first(); if (await pen.count()) { await pen.click(); await sleep(1200); edit = await page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.slice(0, 300) || [...document.querySelectorAll('[role=option]')].map(e => e.innerText.trim()).join(' | ')); } }
await shot('1324-02-inline-open');
return done({ idx, cellText, edit });
