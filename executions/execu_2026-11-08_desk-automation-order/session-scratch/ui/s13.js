const { openEditor } = require('./lib-ed');
const NAME = 'QA AO WF C5 عربي 😀 <img src=x onerror=window.__x5=1>';
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, NAME, 'Create or Edit');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  log('C5_header', (await main.innerText()).split('\n')[0]);
  await L.openConditions();
  await L.setCond(0, 'Subject', 'starts with', 'QA AO WF C5 ');
  await clk(main.getByRole('button', { name: 'Add condition' }).first()); await page.waitForTimeout(500);
  await L.setCond(1, 'Priority', 'is one of');
  const row2 = main.locator('button[aria-label="Remove condition"]').nth(1).locator('xpath=..');
  log('E4_row2', (await row2.innerText()).split('\n').filter(Boolean));
  for (const v of ['high', 'urgent']) { const c = row2.getByRole('button', { name: v, exact: true }); if (await c.count()) await clk(c.first()); }
  await page.waitForTimeout(400); log('E4_after', (await L.condText()).split('\n').filter(Boolean).slice(0, 8));
  await clk(main.getByRole('button', { name: 'Add condition' }).first()); await page.waitForTimeout(500);
  await L.setCond(2, 'Subject', 'contains', 'عربي😀‍');
  // E7 toggle connector 2
  await clk(main.getByRole('button', { name: 'Toggle AND/OR for this connector' }).nth(1)); await page.waitForTimeout(400);
  log('E7_pattern', (await L.condText()).split('\n').filter(l => /pattern|\(|and|or/i.test(l)).slice(0, 6));
  // E9 pattern errors
  const nBefore = await main.locator('input[type=text]').count();
  await clk(main.getByRole('button', { name: 'Edit Pattern' }).first()); await page.waitForTimeout(700);
  const vals = await main.locator('input[type=text]').evaluateAll(b => b.map(x => x.value));
  log('E9_inputsAfterEdit', { nBefore, vals });
  const idx = vals.findIndex(v => /[(]|and|or/.test(v)); const pin = main.locator('input[type=text]').nth(idx >= 0 ? idx : vals.length - 1);
  const E9 = {};
  for (const p of ['1 and', '(1 and 2', '1 and 4', '1 and 2', '1 and 2 or 3', '1 && 2 || 3']) { await pin.fill(p); await pin.press('Tab'); await page.waitForTimeout(400); E9[p] = (await L.condText()).split('\n').filter(l => /pattern|paren|condition|unused|invalid|missing|mix|bracket|number/i.test(l)).slice(-3); }
  log('E9', E9);
  await pin.fill('(1 and 2) or 3'); await pin.press('Tab'); await page.waitForTimeout(400);
  log('E8_text', (await L.condText()).split('\n').filter(l => /pattern|\(/i.test(l)).slice(-3));
  await shot('s13-pattern', { full: true });
  // Field Update Description
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
  await clk(main.getByRole('button', { name: /^Field Update/ }).first()); await page.waitForTimeout(800);
  await clk(main.getByRole('button', { name: 'Add field' }).first()); await page.waitForTimeout(500);
  await L.choose(main.locator('button[aria-label="— select field —"]').last(), 'Description');
  await main.locator('xpath=//button[@aria-label="Remove Description"]/..//input | //button[@aria-label="Remove Description"]/..//textarea').first().fill('QA WF C5 done');
  // G2 + G4 double click save
  const save = main.getByRole('button', { name: 'Save & Activate' }).first();
  await Promise.all([clk(save), clk(save)]); await page.waitForTimeout(3500);
  log('G2_url', page.url()); log('G2_toasts', await page.locator('[data-sonner-toast]').allInnerTexts());
  log('G2_fix', ((await main.innerText()).split('Fix these before saving:')[1] || '').slice(0, 300));
  log('C5_xss', await page.evaluate(() => window.__x5 || 0));
  await shot('s13-saved', { full: true });
};
