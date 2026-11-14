const A = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd';
const openEdit = async () => { await go('/settings/developer/custom-actions', 10000); await page.locator('#main-content').getByText('API sources', { exact: true }).first().click(); await sleep(3000);
  await page.locator('#main-content tr').filter({ hasText: 'QA GL W3 echo API' }).first().locator('button').last().click(); await sleep(1000); await page.getByRole('menuitem', { name: /Edit/ }).first().click(); await sleep(3000); return page.locator('[role=dialog]').last(); };
const run = async ref => (await api('POST', '/workflow/custom-actions/' + A + '/run', { runtimeInputs: { ref, note: 'QA GL W3 auth run' }, context: { app: 'desk', moduleId: TM, recordId: T1, label: 'x' } })).s;
for (const [kind, idx] of [['bearer', 2], ['basic', 3]]) {
  const d = await openEdit(); await d.getByRole('button', { name: 'Authentication' }).click(); await sleep(1000); await page.getByRole('option').nth(idx).click(); await sleep(1200);
  const ins = d.locator('input:visible'); const n = await ins.count(); out[kind + 'Form'] = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300);
  for (let i = 2; i < n; i++) await ins.nth(i).fill(i === n - 1 ? 'qa-gl-w3-dummy-pass-456' : 'qa-gl-w3-user');
  await d.getByRole('button', { name: 'Save' }).click(); await sleep(3000); out[kind + 'Save'] = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ');
  out[kind + 'Run'] = await run('QAREF-' + kind.toUpperCase()); await sleep(1500); }
return fin({ out });
