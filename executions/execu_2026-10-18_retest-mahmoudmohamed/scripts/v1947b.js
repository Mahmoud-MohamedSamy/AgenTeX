const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = { posts: [] };
const fr = async r => { const m = r.request().method(); if (m !== 'GET' && /\/views/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch (e) { } out.posts.push(r.status() + ' ' + m + ' ' + r.url().replace(API, '') + ' ' + (r.request().postData() || '').slice(0, 160) + ' -> ' + b); } }; page.on('response', fr);
await page.goto(H + '/modules/' + L, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 40 && !(await page.getByRole('button', { name: 'Manage columns' }).count()); i++) await sleep(1000);
// 1) Manage columns → change → banner
await page.getByRole('button', { name: 'Manage columns' }).click(); await sleep(2000);
const dlg = page.locator('[role=dialog]').last(); const hide = dlg.locator('button[aria-label^="Hide "]:not([disabled])').first(); out.hideBtn = await hide.count();
if (out.hideBtn) await hide.click(); else await dlg.getByText('Hide', { exact: true }).first().click(); await sleep(600);
await dlg.getByRole('button', { name: 'Apply' }).click(); await sleep(3000);
out.banner = ((await txt()).match(/[^\n]*(changed the columns|Only you see|Save (as|to) (a )?view|view's columns)[^\n]*/gi) || []).slice(0, 4);
out.bannerButtons = (await page.getByRole('button').allInnerTexts()).filter(t => /save|view's columns|reset|new view/i.test(t)).slice(0, 6);
await shot('NDC-1947-user2-after-columns');
// 2) New custom view, private, save
await page.getByRole('button', { name: 'Custom views' }).click(); await sleep(1500);
out.cvMenu = (await page.locator('[role=menu], [role=listbox], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await page.getByText(/New (custom )?view/i).first().click(); await sleep(5000);
await page.getByPlaceholder(/custom view name/i).fill('QA RT private-user2');
out.shareText = ((await txt()).match(/[^\n]*(Share this with|Only me|Everyone|Selected users)[^\n]*/gi) || []).slice(0, 6);
await shot('NDC-1947-user2-new-view-form');
await page.getByRole('button', { name: 'Save' }).last().click(); await sleep(5000);
out.afterSaveUrl = page.url().replace(H, ''); await shot('NDC-1947-user2-after-save');
page.off('response', fr); return done(out);
