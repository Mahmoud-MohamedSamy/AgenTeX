const A = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd', SRC = '56a69b17-df26-4ecc-a5f6-77c95f75f39c';
const openEdit = async () => { await go('/settings/developer/custom-actions', 10000); await page.locator('#main-content').getByText('API sources', { exact: true }).first().click(); await sleep(3000);
  await page.locator('#main-content tr').filter({ hasText: 'QA GL W3 echo API' }).first().locator('button').last().click(); await sleep(1000); await page.getByRole('menuitem', { name: /Edit/ }).first().click(); await sleep(3000); return page.locator('[role=dialog]').last(); };
let d = await openEdit();
await d.getByRole('button', { name: 'Authentication' }).click(); await sleep(1000); await page.getByRole('option', { name: 'API key' }).first().click().catch(() => page.getByText('API key', { exact: true }).last().click()); await sleep(1200);
out.akForm = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 600);
out.akCtrls = await d.locator('input:visible').evaluateAll(es => es.map(e => [e.type, e.placeholder, e.getAttribute('aria-label')].join('|')));
const ins = d.locator('input:visible'); const n = await ins.count();
// expected: name, base url, header name, key value (+maybe location)
for (let i = 2; i < n; i++) { const ph = ((await ins.nth(i).getAttribute('placeholder')) || '') + ((await ins.nth(i).getAttribute('aria-label')) || ''); const ty = await ins.nth(i).getAttribute('type');
  if (ty === 'password' || /key value|value|secret/i.test(ph)) await ins.nth(i).fill('qa-gl-w3-dummy-key-123'); else await ins.nth(i).fill('X-QA-GL-W3-Key'); }
await shot('w3/W3-12-apikey-filled');
await d.getByRole('button', { name: 'Save' }).click(); await sleep(3000); out.saveToast = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ');
d = await openEdit(); out.reopen = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500); out.reopenVals = await d.locator('input:visible').evaluateAll(es => es.map(e => e.type + '=' + (e.type === 'password' ? '[pw len ' + e.value.length + ']' : e.value)));
await shot('w3/W3-12-apikey-reopen'); await page.keyboard.press('Escape');
const sg = await api('GET', '/workflow/custom-actions/sources/' + SRC); out.srcApi = sg.s + ' ' + JSON.stringify(D(sg.j)).replace(/qa-gl-w3-dummy-key-123/g, '<<PLAINTEXT KEY>>').slice(0, 700);
// run
const rr = await api('POST', '/workflow/custom-actions/' + A + '/run', { runtimeInputs: { ref: 'QAREF-KEY', note: 'QA GL W3 api key run' }, context: { app: 'desk', moduleId: TM, recordId: T1, label: 'QA GL W3 plan ticket 1' } });
out.run = rr.s + ' ' + rr.t.replace(/qa-gl-w3-dummy-key-123/g, '<<PLAINTEXT KEY>>').slice(0, 600);
return fin({ out });
