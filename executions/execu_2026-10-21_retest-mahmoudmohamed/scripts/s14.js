const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const R = {};
// 2252 + 2250: setup module list
await go('/settings/modules-and-fields', 12000);
R.setupButton = (await txt()).match(/Set up your [A-Za-z]+/g);
const rows = await page.locator('tbody tr').allInnerTexts(); R.lastModified = rows.slice(0, 10).map(r => r.replace(/\s+/g, ' ').slice(0, 120));
await shot('2250-01-modules-list');
// 2239 Rename Module on Tickets default layout
const lays = arr((await api('GET', `/modules/${TK}/layouts`)).j.data); const def = lays.find(l => l.isDefault) || lays[0];
await builder(TK, def.id); for (let i = 0; i < 30 && /Layout Builder\n\|\nStandard Layout/.test(await txt()); i++) await sleep(1500); await sleep(2000);
await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(900);
R.gearMenu = (await page.locator('[role=menu]').allInnerTexts()).join('|') || (await txt()).match(/Rename Module[\s\S]{0,200}/)?.[0];
await page.getByText('Rename Module', { exact: true }).first().click(); await sleep(2000);
R.renameDialog = (await page.locator('[role=dialog]').allInnerTexts()).join('|').slice(0, 600); R.crash = /Something went wrong|reading 'trim'/.test(await txt());
R.renameInputs = await page.locator('[role=dialog] input').evaluateAll(es => es.map(e => (e.placeholder || e.name || '') + '=' + e.value));
await shot('2239-01-rename-dialog');
await page.locator('[role=dialog]').getByRole('button', { name: 'Cancel' }).first().click().catch(() => page.keyboard.press('Escape')); await sleep(800);
// 2258 accessible names in the builder
R.a11y = await page.evaluate(() => { const out = []; const sw = [...document.querySelectorAll('[role=switch]')]; for (const s of sw) out.push('switch: ' + (s.getAttribute('aria-label') || s.getAttribute('aria-labelledby') || s.title || 'NO NAME'));
  const btns = [...document.querySelectorAll('button')].filter(b => !b.innerText.trim()); const noName = btns.filter(b => !(b.getAttribute('aria-label') || b.title || b.getAttribute('aria-labelledby')));
  out.push('icon-only buttons: ' + btns.length + ', without accessible name: ' + noName.length); out.push(...noName.slice(0, 8).map(b => 'NO NAME: ' + b.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '<svg/>').slice(0, 160))); return out; });
await shot('2258-01-builder');
return done(R);
