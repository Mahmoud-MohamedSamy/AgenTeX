const { openEditor } = require('./lib-ed');
const V = 'عربي 😀 <b>x</b> a‍b';
module.exports = async (h) => {
  const { page, ctx, shot, log, go, BASE } = h;
  const part = async (k, fn) => { try { await fn(); } catch (e) { log(k + '_ERR', String(e.message).split('\n')[0].slice(0, 250)); await shot('rx-' + k + '-err').catch(() => {}); } };
  const toasts = async () => page.locator('[data-sonner-toast]').allInnerTexts().catch(() => []);
  const fu = async (L, main, val) => {
    await L.clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
    await L.clk(main.getByRole('button', { name: /^Field Update/ }).first()); await page.waitForTimeout(800);
    await L.clk(main.getByRole('button', { name: 'Add field' }).last()); await page.waitForTimeout(500);
    await main.locator('xpath=//button[@aria-label="Remove Subject"]/..//input | //button[@aria-label="Remove Subject"]/..//textarea').last().fill(val);
  };
  // E15: Arabic/emoji/HTML/ZWJ value saved from the screen
  await part('e15', async () => {
    await openEditor(h, 'QA AO WF E15 value', 'Create');
    const L = require('./lib-cond')(page); const { main, clk } = L;
    await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF E15 ');
    await clk(main.getByRole('button', { name: 'Add condition' }).first()); await page.waitForTimeout(500);
    await L.setCond(1, 'Subject', 'contains', V);
    await fu(L, main, 'QA AO WF E15 done');
    await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(3500);
    log('e15_url', page.url()); log('e15_toasts', await toasts());
  });
  // F10: webhook URLs on screen
  await part('f10', async () => {
    await openEditor(h, 'QA AO WF F10 urls', 'Create');
    const L = require('./lib-cond')(page); const { main, clk } = L;
    await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF F10 ');
    await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
    await clk(main.getByRole('button', { name: /^Webhook/ }).first()); await page.waitForTimeout(800);
    const inputs = await main.locator('input').evaluateAll(a => a.map(x => (x.placeholder || '') + '|' + (x.getAttribute('aria-label') || '') + '|' + (x.name || '')).filter(s => /http|url/i.test(s)));
    log('f10_inputs', inputs);
    const url = main.locator('input[placeholder*="http"], input[aria-label*="URL" i], input[name*="url" i]').first();
    const R = {};
    for (const u of ['http://example.com/hook', 'http://localhost/hook', 'http://127.0.0.1/hook', 'http://169.254.169.254/latest/meta-data', 'http://metadata.google.internal/', 'https://example.com/' + 'a'.repeat(2048)]) {
      await url.fill(u); await url.press('Tab'); await page.waitForTimeout(400);
      const inline = (await main.innerText()).split('\n').filter(l => /url|address|internal|private|allowed|invalid|local|long/i.test(l) && l.length < 200).slice(-3);
      await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(2500);
      R[u.slice(0, 45)] = { inline, toast: (await toasts()).slice(-1)[0] || '', url: page.url().includes('/new') ? 'still on editor' : 'SAVED → ' + page.url().slice(-40) };
      if (!page.url().includes('/new')) break;
      await page.locator('[data-sonner-toast] button').first().click().catch(() => {});
    }
    log('f10', R); await shot('rx-f10');
  });
  // G9: session gone with the editor open, then Save
  await part('g9', async () => {
    await openEditor(h, 'QA AO WF G9 session', 'Create');
    const L = require('./lib-cond')(page); const { main, clk } = L;
    await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF G9 ');
    await fu(L, main, 'QA AO WF G9 done');
    const saved = await ctx.storageState();
    await ctx.clearCookies(); await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/token|auth|session|access|refresh/i.test(k)) localStorage.removeItem(k); for (const k of Object.keys(sessionStorage)) sessionStorage.removeItem(k); });
    await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(4000);
    log('g9_url', page.url().replace(/\?.*/, '')); log('g9_toasts', await toasts());
    log('g9_text', (await page.locator('body').innerText()).split('\n').filter(l => /sign|log ?in|session|expired|unauthor/i.test(l)).slice(0, 5));
    log('g9_draftKept', await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).length));
    await shot('rx-g9');
    await ctx.addCookies(saved.cookies);
    await page.goto(BASE + '/settings/automation/workflow-rules'); await page.waitForTimeout(2000);
    await page.evaluate(o => { for (const x of o) for (const i of x.localStorage) localStorage.setItem(i.name, i.value); }, saved.origins.filter(o => BASE.startsWith(o.origin)));
    await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
  });
};
