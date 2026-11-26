const st = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'out/state.json'), 'utf8'));
const reqs = [];
page.on('request', r => { if (/\/resolution/.test(r.url()) && r.method() !== 'GET') reqs.push(r.method() + ' ' + r.url().replace(/^.*\/api\/v1/, '') + ' ' + (r.postData() || '').slice(0, 300)); });
page.on('response', async r => { if (/\/resolution/.test(r.url()) && r.request().method() !== 'GET') { let b = ''; try { b = (await r.text()).slice(0, 400); } catch (e) {} reqs.push('-> ' + r.status() + ' ' + b); } });
const out = {};
await go('/views/all/tickets/' + st.RN.a); await sleep(6000);
await page.getByRole('tab', { name: /^Resolution/i }).first().click().catch(async () => page.getByText(/^Resolution$/i).first().click()); await sleep(2500);
await shot('r-a-tab');
out.tabText = (await page.locator('main').innerText().catch(() => '')).slice(0, 900);
// open edit
const edit = page.getByRole('button', { name: /^Edit$/ }).last();
const actions = page.getByRole('button', { name: /Resolution actions/i });
if (await actions.count()) { await actions.first().click(); await sleep(800); await page.getByRole('menuitem', { name: /Edit/ }).first().click().catch(() => {}); }
else if (await edit.count()) await edit.click();
await sleep(1500);
const editor = page.locator('[contenteditable="true"]').last();
await editor.click(); await page.keyboard.press('End'); await page.keyboard.type(' Please accept.');
const notify = page.getByLabel(/Notify customer/i);
out.notifyFound = await notify.count();
if (out.notifyFound) { if (!(await notify.isChecked())) await notify.check(); }
else { await page.getByText(/Notify customer/i).first().click().catch(() => {}); }
await shot('r-a-edit-notify');
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(5000);
out.toast = (await page.locator('[role=status], [data-sonner-toast], .toast').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300);
await shot('r-a-saved');
out.reqs = reqs;
return out;
