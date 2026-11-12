const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 700) + ' => ' + x.t.slice(0, 300));
await go('/knowledge-base/articles/new', 12000);
const n0 = NET.length;
await page.locator('input[placeholder="Add title here"]').fill('QA GL W4 article');
const ed = page.locator('[aria-label="Article content"]').first(); await ed.click(); await page.keyboard.type('This is the QA GL W4 knowledge base article. Search word: zebrafish42.');
// image via the editor image input (second file input)
const png = RUN + '/evidence/raw/w4/W4-42-portal-home.png';
const fins = page.locator('main input[type=file]'); out.nFile = await fins.count();
try { await fins.nth(1).setInputFiles(png); await sleep(5000); } catch (e) { out.imgErr = e.message.slice(0, 120); }
out.imgs = await ed.locator('img').count();
await page.getByRole('button', { name: /^Category/ }).first().click(); await sleep(1000); await page.getByRole('option', { name: /^QA GL W4 KB$/ }).first().click().catch(async () => { await page.getByText('QA GL W4 KB', { exact: true }).last().click(); }); await sleep(800);
await page.getByText('All users', { exact: true }).first().click().catch(() => {});
await page.getByRole('button', { name: /^Publish$/ }).first().click(); await sleep(5000);
const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.getByRole('button', { name: /^Publish/ }).last().click().catch(() => {}); await sleep(4000); }
out.msg = (await page.locator('[data-sonner-toast],[role=alert]').allInnerTexts()).join(' / ').slice(0, 300);
out.url = page.url().replace(H, ''); out.net = nn(n0);
const a = arr(D((await api('GET', '/desk/kb/articles?limit=50')).j)); out.arts = a.map(x => x.id + ' | ' + x.title + ' | ' + x.status + ' | ' + (x.permalink || x.slug || '') + ' | ' + Object.keys(x).join(',')).slice(0, 5);
for (const x of a) if (/QA GL W4/.test(x.title)) CREATED.push({ kind: 'kb-article', id: x.id, name: x.title });
await shot('w4/W4-60-published');
return fin({ out });
