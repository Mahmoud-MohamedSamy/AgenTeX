const d = page.locator('[role=dialog]').last(); await d.getByPlaceholder('Enter view name').fill('QA RT 2282 kb'); await d.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(12000);
await shot('2282-02-kanban-toolbar');
const combos = await page.locator('button[role=combobox]:visible, select:visible, [aria-haspopup=listbox]:visible').evaluateAll(a => a.map(x => ({ text: (x.innerText || '').trim().split('\n')[0].slice(0, 30), aria: x.getAttribute('aria-label'), y: Math.round(x.getBoundingClientRect().y), x: Math.round(x.getBoundingClientRect().x) })).filter(o => o.y < 260));
const visibleLabels = (await txt()).split('\n').filter(l => /^(Layout|Pipeline)\b/.test(l.trim())).slice(0, 6);
return done({ url: page.url(), combos, visibleLabels });
