await page.mouse.click(1323, 627); await sleep(2500);
await shot('NDC-2095-locale-edit');
const d = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const ctr = []; for (const e of await page.locator('[role=dialog] button, [role=dialog] input, [role=dialog] [role=combobox], main [role=combobox], main input').all()) ctr.push(((await e.getAttribute('aria-label')) || (await e.getAttribute('placeholder')) || '') + ' | ' + ((await e.innerText().catch(() => '')) || (await e.inputValue().catch(() => ''))).trim().slice(0, 40));
return done({ d: d.slice(0, 500), ctr: ctr.slice(0, 20) });
