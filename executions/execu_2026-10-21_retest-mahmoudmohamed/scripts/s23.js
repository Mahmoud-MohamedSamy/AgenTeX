await go('/settings/modules-and-fields/c0394292-52a2-446d-a326-06733fe289ba', 12000);
const dir = await page.evaluate(() => document.documentElement.dir + ' ' + document.documentElement.lang);
const lines = (await txt()).split('\n').map(l => l.trim()).filter(l => /[A-Za-z]{3,}/.test(l) && !/QA RT|QA MF|Ctrl|^Default$|L2|^AR$/.test(l));
await shot('2249-01-arabic-layouts');
return done({ dir, englishLines: lines });
