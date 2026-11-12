out.ar = await mk(CM, 'contact', 'QA GL W5 Arabic', { first_name: 'QA GL W5', last_name: 'محمد عربي', email: 'qa-gl-w5-ar@example.com', title: 'مدير المبيعات' });
if (out.ar.id) { const g = await get(CM, out.ar.id); out.arBack = g.last_name + ' / ' + g.title; }
const v = await api('POST', '/modules/' + CM + '/views', { name: 'QA GL W5 view', kind: 'list', visibility: 'private', settings: { criteria: { conditions: [{ field: 'first_name', operator: 'contains', value: 'QA GL W5' }] } } });
out.view = v.s + ' ' + (v.s >= 300 ? v.t.slice(0, 250) : ''); const vid = v.j && v.j.data && v.j.data.id; if (vid) CREATED.push({ kind: 'view', id: vid, name: 'QA GL W5 view', mod: CM }); out.vid = vid;
// UI: open view, Find duplicates
await go('/modules/' + CM, 9000);
if (vid) { await go('/modules/' + CM + '?view=' + vid, 8000); out.viewUi = (await mtxt()).slice(0, 300); await shot('w5/W5-07-view'); }
await go('/modules/' + CM, 8000);
await page.getByRole('button', { name: /Find duplicates/i }).first().click().catch(e => out.fdErr = e.message.slice(0, 60)); await sleep(6000);
out.dupPage = page.url().replace(H, ''); out.dupText = (await mtxt()).slice(0, 700);
await shot('w5/W5-05-duplicates');
if (out.ar.id) { await go('/modules/' + CM + '/customers/' + out.ar.id, 9000); out.arPage = (await mtxt()).slice(0, 300); out.arDir = await page.getByText('محمد عربي').first().evaluate(e => getComputedStyle(e).direction).catch(() => '?'); await shot('w5/W5-06-arabic'); }
// W5-08 portal access on contact 1
await go('/modules/' + CM + '/customers/' + C1, 9000); out.c1Page = (await mtxt()).slice(0, 700);
out.c1Btns = (await page.locator('main button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 40);
const more = page.getByRole('button', { name: /more|actions/i }).first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(1500); out.c1Menu = (await page.locator('[role=menu]').allInnerTexts()).join(' / ').replace(/\s+/g, ' ').slice(0, 300); await page.keyboard.press('Escape'); }
await shot('w5/W5-08-contact-page');
return fin({ out });
