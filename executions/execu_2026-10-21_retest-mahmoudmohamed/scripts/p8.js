await page.mouse.click(450, 603); await sleep(1500);
let opts = await page.locator('[role=option], [role=listbox] li, [role=menuitem]').allInnerTexts();
await shot('1172-03b-admin-dropdown');
if (!opts.length) { await page.mouse.click(615, 603); await sleep(1500); opts = await page.locator('[role=option], [role=listbox] li, [role=menuitem], [role=dialog]').allInnerTexts(); await shot('1172-03c-admin-icon'); }
return done({ opts: opts.map(x => x.slice(0, 200)).slice(0, 20) });
