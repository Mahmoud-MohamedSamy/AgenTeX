const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  const resp = []; page.on('response', async r => { if (/\/workflow\/rules/.test(r.url()) && ['POST', 'PUT', 'PATCH'].includes(r.request().method())) resp.push(r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 220)); });
  const seen = []; const tw = setInterval(async () => { for (const t of await page.locator('[data-sonner-toast]').allInnerTexts().catch(() => [])) if (!seen.includes(t)) seen.push(t); }, 300);
  await openEditor(h, 'QA AO WF F10 urls', 'Create');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF F10 ');
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
  await clk(main.getByRole('button', { name: /^Webhook/ }).first()); await page.waitForTimeout(800);
  await main.locator('textarea').last().fill('{"qa":"F10"}');
  const url = main.locator('input[aria-label="Webhook URL"]').first();
  const R = {};
  for (const u of ['http://localhost/hook', 'http://127.0.0.1/hook', 'http://169.254.169.254/latest/meta-data', 'http://metadata.google.internal/', 'http://10.0.0.5/hook', 'https://example.com/' + 'a'.repeat(2048), 'http://example.com/hook']) {
    resp.length = 0; seen.length = 0;
    await url.fill(u); await url.press('Tab'); await page.waitForTimeout(300);
    await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(3000);
    const fx = ((await page.locator('main').last().innerText().catch(() => '')).split('Fix these before saving:')[1] || '').slice(0, 200);
    R[u.slice(0, 42)] = { server: resp.slice(), toast: seen.slice(), fix: fx, savedNav: !page.url().includes('/new') };
    if (!page.url().includes('/new')) break;
  }
  clearInterval(tw); log('f10', R); await shot('rx-f10');
};
