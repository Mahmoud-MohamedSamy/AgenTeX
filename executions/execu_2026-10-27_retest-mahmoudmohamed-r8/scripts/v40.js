// NDC-1335: new Leads layout with predefined fields only → Save.
const out = { reqs: [] };
page.on('response', async r => { const q = r.request(); if (['PUT', 'POST', 'PATCH'].includes(q.method()) && /\/modules\/841043e1[^/]*\/(layouts|fields)/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 220); } catch (e) {} out.reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '').slice(0, 110) + ' => ' + b); } });
await page.setViewportSize({ width: 1600, height: 900 }); await go('/settings/modules-and-fields', 6000); for (let j = 0; j < 60 && !(await txt()).includes('Create New Module'); j++) await sleep(2000); await sleep(2000);
const lb = await page.locator('table, [role=table]').getByText('Leads', { exact: true }).first().boundingBox().catch(() => null); if (lb) await page.mouse.click(lb.x + 10, lb.y + 8); else await page.mouse.click(397, 256);
for (let j = 0; j < 40 && !(await txt()).includes('Create New Layout'); j++) await sleep(2000);
await page.getByRole('button', { name: /Create New Layout/ }).first().click(); for (let j = 0; j < 60 && !/Save/.test(await txt()); j++) await sleep(2000); await sleep(15000);
await shot('v40-new-layout-builder'); out.builder = (await txt()).split('\n').map(l => l.trim()).filter(l => /Layout name|Untitled|New Layout|Save|Cancel/i.test(l)).slice(0, 8);
const nameInput = page.locator('input[placeholder*="ayout" i], input[aria-label*="ayout" i]').first(); if (await nameInput.count()) { await nameInput.fill('QA RT r8 new layout'); await sleep(800); }
await page.getByRole('button', { name: /^Save( Layout)?$/ }).first().click(); await sleep(60000); await shot('v40-after-save');
out.msgs = (await txt()).split('\n').map(l => l.trim()).filter(l => /saved|created|success|Failed|Couldn't|Subform|error|subfield/i.test(l)).slice(0, 8); out.url = page.url();
return done(out);
