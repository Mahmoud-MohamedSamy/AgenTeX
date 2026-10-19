await sleep(12000); await shot('NDC-2095-company-settings-before');
const t = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ');
const i = t.search(/time ?zone/i);
return done({ len: t.length, around: t.slice(Math.max(0, i - 200), i + 300), head: t.slice(0, 500) });
