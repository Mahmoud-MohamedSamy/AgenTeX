// H9: Selected Users with nobody picked; A8: owner as the only principal.
const cap = []; const onW = r => { if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|/iam/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 300)); };
page.on('request', onW);
const open = async () => { await go('/settings/modules-and-fields', 6000); const row = page.locator('tr', { hasText: 'QA MF Open' }).first(); await row.hover(); await sleep(300);
  await page.locator('button[aria-label="Open menu for QA MF Open1"]').first().click(); await sleep(700);
  await page.locator('button,[role=menuitem]', { hasText: /^Access Control$/ }).last().click(); await sleep(1800);
  const lab = page.locator('label', { hasText: 'Selected Users' }).last(); await lab.click(); await sleep(1500); if (!(await page.getByText(/^Select principals for/).count())) { await lab.locator('div').first().click(); await sleep(1500); } if (!(await page.getByText(/^Select principals for/).count())) { await shot('A8-open-debug'); throw new Error('picker did not open'); } };
const picker = () => page.locator('xpath=//*[starts-with(normalize-space(.),"Select principals for") and not(*)]/ancestor::div[.//button[normalize-space(.)="Save"]][1]');
// A8
await open();
const p8 = picker(); await p8.getByRole('button', { name: /^Save$/ }).click(); await sleep(1500);
let m8 = ''; await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(2500);
m8 = ((await txt()).replace(/\s+/g, ' ').match(/(Access settings saved|Failed[^.]*)\.?/i) || [''])[0];
const s8 = await shot('A8-owner-only');
page.off('request', onW);
const mm = (await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c')).j.data;
rec('A8.owner', 'INFO', `owner-only principal saved: message "${m8}"; accessMode ${mm.accessMode || mm.access_mode}; writes ${cap.join(' || ').slice(0, 700)}`, { shot: s8 });
return done();
