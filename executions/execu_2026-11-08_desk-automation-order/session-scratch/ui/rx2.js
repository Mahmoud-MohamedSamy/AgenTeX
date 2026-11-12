const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, ctx, shot, log, go, BASE } = h;
  const part = async (k, fn) => { try { await fn(); } catch (e) { log(k + '_ERR', String(e.message).split('\n')[0].slice(0, 250)); await shot('rx-' + k + '-err').catch(() => {}); } };
  const toasts = async () => page.locator('[data-sonner-toast]').allInnerTexts().catch(() => []);
  // M7: tail of the page (pager?)
  await part('m7', async () => {
    await go('/settings/workflow-executions'); await page.waitForTimeout(3000);
    const t = await page.locator('main').last().innerText(); log('m7_tail', t.slice(-300).replace(/\s+/g, ' '));
    await page.evaluate(() => { [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).forEach(e => e.scrollTop = e.scrollHeight); window.scrollTo(0, 1e6); });
    await page.waitForTimeout(1500); log('m7_rowsAfterScroll', (await page.getByRole('row').count()) - 1); await shot('rx-m7-bottom');
  });
  // C9: draft exists -> open New Rule, Tickets, name, Next -> is the draft offered/restored?
  await part('c9', async () => {
    await openEditor(h, 'QA AO WF C9 draft', 'Create');
    const L = require('./lib-cond')(page); await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF C9 '); await page.waitForTimeout(1500);
    const p2 = await ctx.newPage(); await page.close();
    await p2.goto(BASE + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(3000);
    log('c9_draftKeyStill', await p2.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft'))));
    const dlg = p2.getByRole('dialog').first();
    await p2.getByRole('button', { name: 'New Rule' }).click(); await dlg.waitFor();
    await dlg.getByRole('button', { name: 'Select a module' }).click(); await p2.getByRole('option', { name: 'Tickets' }).click();
    await dlg.getByPlaceholder('e.g. High-Value Lead Notification').fill('QA AO WF C9 second');
    await dlg.getByRole('button', { name: 'Next' }).click(); await p2.waitForTimeout(1200);
    log('c9_step2', (await dlg.innerText().catch(() => '')).split('\n').slice(0, 12));
    await dlg.getByRole('group').getByRole('button', { name: 'Create', exact: true }).click().catch(() => {});
    await dlg.getByRole('button', { name: 'Create', exact: true }).last().click().catch(() => {}); await p2.waitForTimeout(3000);
    const body = await p2.locator('body').innerText();
    log('c9_prompt', body.split('\n').filter(l => /resume|draft|start fresh|discard|unsaved/i.test(l)).slice(0, 6));
    log('c9_editorHasC9cond', /QA AO WF C9/.test(body)); log('c9_title', body.split('\n').find(l => /QA AO WF C9/.test(l)));
    await p2.screenshot({ path: require('path').join(__dirname, 'out', 'rx-c9.png') });
    await p2.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
    h.page = p2;
  });
};
