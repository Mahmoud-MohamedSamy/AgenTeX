const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, ctx, shot, log, go, BASE } = h;
  const part = async (k, fn) => { try { await fn(); } catch (e) { log(k + '_ERR', String(e.message).split('\n')[0].slice(0, 250)); await shot('rx-' + k + '-err').catch(() => {}); } };
  const toasts = async () => page.locator('[data-sonner-toast]').allInnerTexts().catch(() => []);
  const RULE_M5 = '50cc885e-9f08-41dc-827d-bf624e63afe8', TK = 'efd84422-f6ea-4950-8c72-3425544ec348';
  // M5: Execution History row for a Field Changed run
  await part('m5', async () => {
    await go('/settings/workflow-executions'); await page.waitForTimeout(3000);
    const rid = page.locator('input[placeholder="Any"]').first(); await rid.fill(TK); await rid.press('Enter'); await page.waitForTimeout(3000);
    log('m5_rows', (await page.getByRole('row').allInnerTexts()).slice(0, 4).map(r => r.replace(/\s+/g, ' ')));
    await shot('rx-m5');
  });
  // M7: paging
  await part('m7', async () => {
    await go('/settings/workflow-executions'); await page.waitForTimeout(3000);
    const n1 = (await page.getByRole('row').count()) - 1;
    const body = await page.locator('main').innerText(); const pg = body.split('\n').filter(l => /page|of \d|showing|next|previous|load more|\d+ ?[–-] ?\d+/i.test(l)).slice(0, 8);
    log('m7_firstPageRows', n1); log('m7_pagerText', pg);
    const btns = (await page.getByRole('button').allInnerTexts()).filter(t => /next|prev|more|›|»|older|newer|\d/i.test(t) && t.length < 20); log('m7_buttons', btns);
    const nx = page.getByRole('button', { name: /next|older|load more|›/i }).first();
    if (await nx.count()) { const first = await page.getByRole('row').nth(1).innerText(); await nx.click(); await page.waitForTimeout(2500); log('m7_page2_rows', (await page.getByRole('row').count()) - 1); log('m7_page2_firstDiffers', first !== await page.getByRole('row').nth(1).innerText()); }
    await page.mouse.wheel(0, 20000); await page.waitForTimeout(800); await shot('rx-m7-bottom');
  });
  // C9: draft resume
  await part('c9', async () => {
    await openEditor(h, 'QA AO WF C9 draft', 'Create');
    const L = require('./lib-cond')(page); await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF C9 ');
    await page.waitForTimeout(1500);
    log('c9_draftKeys', await page.evaluate(() => Object.keys(localStorage).filter(k => /draft/i.test(k))));
    const p2 = await ctx.newPage(); await page.close(); h.page = p2;
    await p2.goto(BASE + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(3000);
    await p2.getByRole('button', { name: 'New Rule' }).click(); await p2.waitForTimeout(1500);
    const dlg = p2.getByRole('dialog').first(); log('c9_dialog1', (await dlg.innerText().catch(() => '')).slice(0, 300));
    await dlg.getByRole('button', { name: 'Select a module' }).click().catch(() => {}); await p2.getByRole('option', { name: 'Tickets' }).click().catch(() => {}); await p2.waitForTimeout(1500);
    log('c9_afterModule', (await p2.getByRole('dialog').first().innerText().catch(() => '')).slice(0, 400));
    log('c9_bodyResume', (await p2.locator('body').innerText()).split('\n').filter(l => /resume|draft|start fresh|discard/i.test(l)).slice(0, 6));
    await p2.screenshot({ path: require('path').join(__dirname, 'out', 'rx-c9.png') });
    const res = p2.getByRole('button', { name: /resume/i }).first();
    if (await res.count()) { await res.click(); await p2.waitForTimeout(3000); log('c9_resumed', (await p2.locator('main').last().innerText()).slice(0, 400)); }
    // start fresh path
    await p2.goto(BASE + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(2500);
    await p2.getByRole('button', { name: 'New Rule' }).click(); await p2.waitForTimeout(1200);
    await p2.getByRole('dialog').first().getByRole('button', { name: 'Select a module' }).click().catch(() => {}); await p2.getByRole('option', { name: 'Tickets' }).click().catch(() => {}); await p2.waitForTimeout(1200);
    const sf = p2.getByRole('button', { name: /start fresh/i }).first();
    if (await sf.count()) { await sf.click(); await p2.waitForTimeout(1200); log('c9_startFresh', (await p2.locator('body').innerText()).split('\n').filter(l => /discard|draft|sure/i.test(l)).slice(0, 5)); await p2.screenshot({ path: require('path').join(__dirname, 'out', 'rx-c9-fresh.png') }); const d = p2.getByRole('button', { name: /discard/i }).last(); if (await d.count()) await d.click(); }
    await p2.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
  });
};
