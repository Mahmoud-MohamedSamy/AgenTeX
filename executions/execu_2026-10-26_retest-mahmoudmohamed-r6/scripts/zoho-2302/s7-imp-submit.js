// On the Assign step: set the "Trigger configured automations..." checkbox (off = leave unticked, on = tick), screenshot, Submit.
module.exports = async ({ page, shot, log, args }) => {
  const mode = args[0];
  const label = page.getByText('Trigger configured automations and processes for new and updated records', { exact: true }).locator('visible=true').first();
  await label.hover(); await page.waitForTimeout(2000);
  log('TOOLTIP', (await page.locator('lyte-tooltip:visible, .lyteTooltip:visible, [role=tooltip]:visible').allInnerTexts()).join('|'));
  if (mode === 'on') { await label.click(); await page.waitForTimeout(1500); }
  const st = await page.evaluate(() => { const l = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && /Trigger configured automations/.test(e.textContent)); const box = l && (l.closest('lyte-checkbox') || l.closest('label') || l.parentElement); const inp = box && box.querySelector('input'); return { tag: box && box.tagName, checked: inp ? inp.checked : null, html: box ? box.outerHTML.slice(0, 600) : '' }; });
  log('STATE', JSON.stringify(st));
  await page.mouse.move(900, 650);
  await shot(`imp-${mode}-before-submit`);
  await page.getByText('Submit', { exact: true }).locator('visible=true').last().click();
  await page.waitForTimeout(10000);
  await shot(`imp-${mode}-after-submit`);
  log('AFTER', page.url(), (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 1500));
};
