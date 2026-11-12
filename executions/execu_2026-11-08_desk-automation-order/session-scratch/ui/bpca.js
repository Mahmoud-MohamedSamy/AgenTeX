module.exports = async (h) => {
  const { page, shot, log, go } = h;
  const W = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-08_desk-automation-order/a4/webhook-token.json', 'utf8')).uuid;
  const spec = JSON.stringify({ openapi: '3.0.0', info: { title: 'QA BP echo', version: '1' }, servers: [{ url: 'https://webhook.site' }], paths: { ['/' + W + '/qa-bp-ca']: { get: { operationId: 'qaBpEcho', summary: 'QA BP echo', responses: { '200': { description: 'ok' } } } } } }, null, 1);
  const posts = []; page.on('response', async r => { if (/custom-actions/.test(r.url()) && r.request().method() !== 'GET') posts.push(r.request().method() + ' ' + r.url().split('/api/v1')[1] + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 160)); });
  await go('/settings/developer/custom-actions'); await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'New action' }).click(); await page.waitForTimeout(1200);
  const dlg = page.getByRole('dialog').first();
  const step = async (k) => { log(k, (await dlg.innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 40).join(' | ').slice(0, 900)); await shot('bp-ca-' + k); };
  await dlg.getByText('Paste', { exact: true }).click(); await page.waitForTimeout(500);
  await dlg.locator('textarea').first().fill(spec); await page.waitForTimeout(300);
  await dlg.getByRole('button', { name: 'Parse' }).click().catch(() => {}); await page.waitForTimeout(2500);
  await step('s1');
  await dlg.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(2000); await step('s2');
  const cb = dlg.getByRole('checkbox').first(); if (await cb.count() && !(await cb.isChecked().catch(() => true))) await cb.click();
  await dlg.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(2000); await step('s3');
  const desk = dlg.getByRole('checkbox', { name: /Desk/ }).first(); if (await desk.count()) { if (!(await desk.isChecked())) await desk.click(); log('deskChecked', await desk.isChecked()); } else { const d2 = dlg.getByText('Desk', { exact: true }).first(); if (await d2.count()) await d2.click(); log('deskClickedText', true); }
  log('s3_inputs', await dlg.locator('input, textarea, button').evaluateAll(a => a.filter(x => x.offsetParent).map(x => x.tagName + '|' + (x.placeholder || '') + '|' + (x.getAttribute('aria-label') || '') + '|' + (x.tagName==='BUTTON'?x.innerText.slice(0,30):(x.value||'').slice(0,30)))));
  const bu = dlg.getByPlaceholder(/https?:\/\//).first(); if (await bu.count()) { await bu.fill('https://webhook.site'); log('baseFilled', true); } else { const nb = dlg.getByText('Not set yet').first(); if (await nb.count()) { await nb.click(); await page.waitForTimeout(800); log('afterNotSet', await dlg.locator('input').evaluateAll(a => a.filter(x => x.offsetParent).map(x => (x.placeholder || '') + '|' + (x.getAttribute('aria-label') || '')))); const b2 = dlg.getByPlaceholder(/https?:/).first(); if (await b2.count()) { await b2.fill('https://webhook.site'); log('baseFilled2', true); } } }
  const dn = dlg.getByLabel(/Display name/).first(); if (await dn.count() && !(await dn.inputValue())) await dn.fill('QA BP echo');
  await page.waitForTimeout(800); await step('s3b');
  await dlg.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(2000); await step('s4');
  const fin = dlg.getByRole('button', { name: /Create|Save|Finish|Done/ }).last(); log('finBtn', await fin.innerText().catch(() => ''));
  await fin.click().catch(() => {}); await page.waitForTimeout(3000);
  log('posts', posts); log('after', (await page.locator('main').last().innerText()).split('Email Providers').pop().slice(0, 500));
  await shot('bp-ca-done');
};
