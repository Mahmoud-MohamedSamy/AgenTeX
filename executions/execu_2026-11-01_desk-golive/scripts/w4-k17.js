const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 200) + ' => ' + x.t.slice(0, 200));
let r = await api('POST', '/desk/kb/article-templates', { name: 'QA GL W4 tpl', title: 'QA GL W4 from template', body_html: '<h2>Problem</h2><p>Describe the problem.</p><h2>Solution</h2><p>Steps.</p>' });
out.tpl = r.s + ' ' + r.t.slice(0, 250); if (r.j && r.j.data && r.j.data.id) CREATED.push({ kind: 'kb-template', id: r.j.data.id, name: 'QA GL W4 tpl' });
await go('/knowledge-base', 10000);
await page.getByText('Templates', { exact: true }).first().click(); await sleep(4000);
out.tplPage = page.url().replace(H, '') + ' :: ' + (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 400);
await page.getByText('Gallery', { exact: true }).first().click(); await sleep(4000);
out.gallery = page.url().replace(H, '') + ' :: ' + (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 400);
const n0 = NET.length;
const fi = page.locator('main input[type=file]').first(); if (await fi.count()) { await fi.setInputFiles(RUN + '/evidence/raw/w4/W4-49-portal-ar.png'); await sleep(6000); }
out.upNet = nn(n0); out.galleryAfter = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 300);
await shot('w4/W4-66-gallery');
// new article from template in the screen
await go('/knowledge-base/articles/new', 10000);
out.newBtns = (await page.locator('main button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 8);
const ut = page.getByRole('button', { name: /template/i }).first(); out.hasTplBtn = await ut.count();
if (out.hasTplBtn) { await ut.click(); await sleep(2500); out.tplPick = (await page.locator('[role=dialog],[role=menu],[role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); }
return fin({ out });
