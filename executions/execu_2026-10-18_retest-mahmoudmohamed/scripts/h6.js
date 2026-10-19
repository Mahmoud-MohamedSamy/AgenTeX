const out = { resp: [] };
const fr = async r => { const m = r.request().method(); if (m !== 'GET' && r.url().includes('/views')) { let b = ''; try { b = (await r.text()).slice(0, 300); } catch (e) { } out.resp.push(r.status() + ' ' + m + ' ' + b); } };
page.on('response', fr);
await page.getByRole('button', { name: 'Save' }).last().click(); await sleep(4000);
out.after = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 300); out.url = page.url();
await shot('NDC-2097-user1-save-attempt');
page.off('response', fr); return done(out);
