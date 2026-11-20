const out = {}; const LANG = process.env.LANG2 || 'en'; const P = LANG;
await page.goto(H + '/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/new', { waitUntil: 'commit' }); await page.evaluate(l => localStorage.setItem('anyware_language', l), LANG); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(2000); if (/Support Plan|خطة الدعم|Sales|المبيعات/i.test(await text())) break; } await sleep(2500);
const deptBtn = () => page.locator('xpath=//*[normalize-space(text())="Department" or normalize-space(text())="القسم"]/following::*[self::button or @role="combobox" or self::select][1]').first();
out.deptTag = await deptBtn().evaluate(e => e.tagName + ' ' + (e.innerText || e.value)).catch(e => 'ERR');
const planBox = () => page.locator('xpath=//*[normalize-space(text())="Support Plan" or normalize-space(text())="خطة الدعم"]/following::*[self::button or self::input or @role="combobox"][1]').first();
out.planTag = 0;
const listPlans = async (k) => { await planBox().click(); await sleep(2500); const opts = await page.locator('[role=option], [role=listbox] li, [cmdk-item]').allInnerTexts(); await shot('2841-' + P + '-' + k + '.png'); await page.keyboard.press('Escape'); await sleep(800); return opts.map(x => x.replace(/\s+/g, ' ').slice(0, 70)); };
const pickDept = async name => { const d = deptBtn(); const tag = await d.evaluate(e => e.tagName); if (tag === 'SELECT') await d.selectOption({ label: name }); else { await d.click(); await sleep(1500); await page.getByRole('option', { name, exact: true }).first().click().catch(async () => { await page.getByText(name, { exact: true }).last().click(); }); } await sleep(2500); };
out.planTag = await planBox().evaluate(e => e.tagName + ' ' + (e.getAttribute('role')||'') + ' ' + (e.innerText || e.placeholder || '')).catch(e=>'ERR'); out.default = await listPlans('a-default');
await pickDept('QA RT19 SLA Dept'); out.deptA = await listPlans('b-deptA');
await planBox().click(); await sleep(1500); await page.getByText('QA RT20 BS Plan 2841 A w2pv').first().click(); await sleep(1500);
out.afterPick = (await text()).replace(/\s+/g, ' ').match(/Support Plan.{0,200}|خطة الدعم.{0,200}/)?.[0];
await shot('2841-' + P + '-c-picked.png');
await pickDept('QA RT19 SLA Dept B'); await sleep(1500);
out.afterDeptChange = (await text()).replace(/\s+/g, ' ').match(/(Support Plan|خطة الدعم).{0,300}/)?.[0];
await shot('2841-' + P + '-d-deptchanged.png');
out.deptB = await listPlans('e-deptB');
const net = []; page.on('response', r => { if (/\/records/.test(r.url()) && r.request().method() === 'POST') net.push(r.status()); });
await page.locator('xpath=//*[normalize-space(text())="Contract Name" or normalize-space(text())="اسم العقد"]/following::input[1]').first().fill('QA RT20 BS Contract 2841 UI ' + P);
const acc = page.getByRole('combobox').filter({ hasText: /Choose a record|اختر سجل/ }).first(); await acc.click(); await sleep(1200); await page.keyboard.type('QA RT20 BS Account 2841 w2pv'); await sleep(3000); await page.getByText('QA RT20 BS Account 2841 w2pv').last().click(); await sleep(1200); await page.getByRole('button', { name: /^(Select|اختيار|اختر)$/ }).last().click(); await sleep(1500); await shot('2841-' + P + '-f0-filled.png', { fullPage: true });
const sd = page.locator('input[type=date]').first(); await sd.fill(new Date().toISOString().slice(0, 10)).catch(async () => { await sd.click(); await page.keyboard.type('11172026'); }); await sleep(800);
await page.getByRole('button', { name: /^(Save|حفظ)$/ }).first().click(); await sleep(4000);
out.save1 = { net: [...net], msg: (await text()).replace(/\s+/g, ' ').match(/(This plan belongs|هذه الخطة|another department|قسم آخر)[^.]{0,160}\./g), url: page.url().replace(H, '') };
await shot('2841-' + P + '-f-save-mismatch.png', { fullPage: true });
if (!/records\/[0-9a-f-]{36}$/.test(page.url())) {
  await planBox().click(); await sleep(1500); await page.getByText('QA RT20 BS Plan 2841 B w2pv').first().click(); await sleep(1500);
  out.afterFix = (await text()).replace(/\s+/g, ' ').match(/(Support Plan|خطة الدعم).{0,200}/)?.[0];
  if (process.env.SAVE2) { await page.getByRole('button', { name: /^(Save|حفظ)$/ }).first().click(); await sleep(5000); out.save2 = { net: [...net], url: page.url().replace(H, '') }; await shot('2841-' + P + '-g-save-ok.png'); }
}
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
return out;
