const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', ID = '5712b381-59ee-4cb4-b025-b7a834d74d86';
await page.mouse.click(1238, 488); await sleep(1200);
const opts = await page.evaluate(() => [...document.querySelectorAll('[role=option],[role=menuitem],[cmdk-item],[role=listbox] li')].filter(e => e.offsetParent).map(e => e.innerText.trim()));
const pop = await page.evaluate(() => [...document.querySelectorAll('[data-radix-popper-content-wrapper]')].map(e => e.innerText.slice(0, 300)));
await shot('1324-04-inline-dropdown');
return done({ opts, pop });
