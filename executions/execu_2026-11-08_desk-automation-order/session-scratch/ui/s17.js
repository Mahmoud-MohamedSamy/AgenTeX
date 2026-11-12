const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  for (const t of ['Webhook', 'Task']) {
    await openEditor(h, 'QA AO WF F-' + t + ' empty', 'Create');
    const L = require('./lib-cond')(page); const { main, clk } = L;
    await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF Fe ');
    await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
    await clk(main.getByRole('button', { name: new RegExp('^' + t) }).first()); await page.waitForTimeout(800);
    log(t + '_inputs', await main.locator('input,textarea').evaluateAll(b => b.slice(9).map(x => [x.placeholder, x.getAttribute('aria-label'), x.required].join('|'))));
    await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(2500);
    log(t + '_save', { url: page.url(), fix: ((await main.innerText()).split('Fix these before saving:')[1] || 'none').split('\n').filter(Boolean).slice(0, 6), toasts: await page.locator('[data-sonner-toast]').allInnerTexts() });
    await shot('s17-' + t, { full: true });
  }
};
