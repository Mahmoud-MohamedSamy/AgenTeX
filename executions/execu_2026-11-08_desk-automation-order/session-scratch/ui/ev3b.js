const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log, go } = h;
  const part = async (k, fn) => { try { await fn(); } catch (e) { log(k + '_ERR', String(e.message).slice(0, 300)); await shot('ev-' + k + '-err').catch(() => {}); } };
  const toasts = async () => page.locator('[data-sonner-toast]').allInnerTexts().catch(() => []);
  const fu = async (L, main, val) => {
    await L.clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
    await L.clk(main.getByRole('button', { name: /^Field Update/ }).first()); await page.waitForTimeout(800);
    await L.clk(main.getByRole('button', { name: 'Add field' }).last()); await page.waitForTimeout(500);
    await main.locator('xpath=//button[@aria-label="Remove Subject"]/..//input | //button[@aria-label="Remove Subject"]/..//textarea').last().fill(val);
  };
  // D-03 + D-02: field list offers Created By; second Field Update refused at save
  await part('d03', async () => {
    await openEditor(h, 'QA AO WF EV2 two field updates', 'Create');
    const L = require('./lib-cond')(page); const { main, clk } = L;
    await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF EV2 ');
    await fu(L, main, 'QA WF EV2 first');
    // second Field Update
    await fu(L, main, 'QA WF EV2 second');
    await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(3000);
    log('d02_toasts', await toasts()); log('d02_fix', ((await main.innerText()).split('Fix these before saving:')[1] || '').slice(0, 300)); log('d02_url', page.url());
    await shot('ev-d02-two-field-updates');
  });
  // D-04: long name refused only at save
  await part('d04', async () => {
    await openEditor(h, 'QA AO WF EV4 ' + 'x'.repeat(240), 'Create');
    const L = require('./lib-cond')(page); const { main, clk } = L;
    await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF EV4 ');
    await fu(L, main, 'QA WF EV4');
    await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(3000);
    log('d04_toasts', await toasts()); log('d04_fix', ((await main.innerText()).split('Fix these before saving:')[1] || '').slice(0, 300)); log('d04_url', page.url());
    await shot('ev-d04-name-length');
  });
  // D-10: double click Save & Activate
  await part('d10', async () => {
    await openEditor(h, 'QA AO WF EV10 double save', 'Create');
    const L = require('./lib-cond')(page); const { main, clk } = L;
    await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF EV10 ');
    await fu(L, main, 'QA WF EV10');
    await main.getByRole('button', { name: 'Save & Activate' }).first().dblclick({ force: true }); await page.waitForTimeout(5000);
    await go('/settings/automation/workflow-rules'); await page.getByRole('row').nth(2).waitFor().catch(() => {});
    const sb = page.getByPlaceholder(/search/i).first(); if (await sb.count()) { await sb.fill('QA AO WF EV10'); await page.waitForTimeout(2000); }
    log('d10_rows', (await page.getByRole('row').allInnerTexts()).filter(r => /EV10/.test(r)).length);
    await shot('ev-d10-two-rules');
  });
  };
