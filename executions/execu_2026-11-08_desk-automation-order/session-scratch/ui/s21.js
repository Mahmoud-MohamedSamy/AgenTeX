const { openEditor } = require('./lib-ed');
const NL = String.fromCharCode(10);
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF E15 F rows', 'Create');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  await L.openConditions();
  await L.setCond(0, 'Subject', 'contains', 'QA AO WF E15 عربي😀‍<b>x</b>');
  const txt = async () => ((await main.innerText()).split('Instant actions')[1] || '').split('Scheduled actions')[0];
  // F6 field update: writable fields offered
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
  await clk(main.getByRole('button', { name: /^Field Update/ }).first()); await page.waitForTimeout(800);
  await clk(main.getByRole('button', { name: 'Add field' }).first()); await page.waitForTimeout(500);
  const fbs = main.locator('button[aria-label="— select field —"]'); log('F6_fieldButtons', await fbs.count());
  const fb = fbs.last(); await fb.scrollIntoViewIfNeeded().catch(() => {}); await fb.click(); await page.waitForTimeout(1500); await shot('s21-f6-open', { full: true });
  const f6 = (await page.locator('xpath=//*[@role="option"]').allInnerTexts()).map(x => x.split(NL)[0]);
  log('F6_count', f6.length); log('F6_system', f6.filter(x => /Created|Modified|Ticket Number|Closed Time|First Response|Happiness|SLA|Archived|Spam|Pending Review/.test(x)));
  if (f6.length) await page.locator('xpath=//*[@role="option"][starts-with(normalize-space(.),"Status")]').first().click(); else await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  // F23 remove the Field Update, picker offers it again
  await clk(main.locator('button[aria-label^="Remove action"], button[aria-label="Delete action"], button:has(svg.lucide-trash-2), button:has(svg.lucide-trash)').first()).catch(e => log('F23_err', String(e).slice(0, 80)));
  await page.waitForTimeout(600); log('F23_after', (await txt()).split(NL).filter(Boolean).slice(0, 4));
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
  log('F23_fieldUpdateOfferedAgain', await main.getByRole('button', { name: /^Field Update/ }).count());
  // F13 Create Record → Calls
  await clk(main.getByRole('button', { name: /^Create Record/ }).first()); await page.waitForTimeout(800);
  const mod = main.locator('button').filter({ hasText: '— select module —' }).first(); await mod.click({ force: true }); await page.locator('[role=option]').first().waitFor({ timeout: 8000 }).catch(() => {});
  log('F13_modules', (await page.locator('[role=option]').allInnerTexts()).map(x => x.split(NL)[0]));
  await page.locator('[role=option]').filter({ hasText: /^Calls/ }).first().click().catch(() => {}); await page.waitForTimeout(1500);
  log('F13_calls', (await txt()).split('Create Record')[1]?.split(NL).filter(Boolean).slice(0, 30));
  // F24 scheduled delay values + F10 webhook URL classes
  await clk(main.getByRole('button', { name: 'Add scheduled action' }).first()); await page.waitForTimeout(600);
  const sch = () => ((main.innerText()).then(t => (t.split('Scheduled actions')[1] || '')));
  await clk(main.getByRole('button', { name: /^Webhook/ }).last()); await page.waitForTimeout(800);
  const sTxt = await sch(); log('F24_form', sTxt.split(NL).filter(l => /delay|after|minute|hour|day|run/i.test(l)).slice(0, 8));
  log('F24_inputs', await main.locator('input').evaluateAll(b => b.map(x => [x.type, x.placeholder, x.getAttribute('aria-label'), x.min, x.max, x.step].join('|')).filter(s => /delay|after|number|amount/i.test(s))));
  await shot('s21-sched', { full: true });
};
