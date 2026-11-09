const apiName = async () => page.evaluate(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && /^API NAME$/i.test(e.textContent.trim())); if (!el) return null; let p = el.parentElement; for (let i = 0; i < 3 && p; i++) { const t = p.innerText.replace(/API NAME/i, '').replace(/Generated from[^\n]*/i, '').trim(); if (t) return t.split('\n')[0]; p = p.parentElement; } return null; });
const a0 = await apiName();
await page.getByPlaceholder('Label in English').fill('Lookup Contacts'); await sleep(1200);
const a1 = await apiName(); await shot('1873-03-renamed');
return done({ before: a0, after: a1 });
