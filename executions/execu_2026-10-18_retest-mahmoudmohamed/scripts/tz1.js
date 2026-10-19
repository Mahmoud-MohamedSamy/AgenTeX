await go('/settings/company/details', 12000);
await shot('NDC-2095-company-settings-before');
const t = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ');
const i = t.search(/time ?zone/i);
const ctr = []; for (const e of await page.locator('main button, main [role=combobox], main select, main input').all()) { const l = (await e.getAttribute('aria-label')) || (await e.getAttribute('name')) || ''; const v = (await e.innerText().catch(() => '')).trim() || (await e.inputValue().catch(() => '')); if (/zone|UTC|Cairo|edit|save/i.test(l + ' ' + v)) ctr.push(l + ' = ' + v.slice(0, 60)); }
return done({ url: page.url(), around: t.slice(Math.max(0, i - 300), i + 400), ctr });
