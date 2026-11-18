await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/RECENT ACTIVITY/i.test(await text()) && /signed in/i.test(await text())) break; }
await sleep(2000);
const pick = async (btnText, opt, name) => {
  await page.getByText(btnText, { exact: true }).first().click(); await sleep(1200);
  const opts = await page.locator('[role=option]:visible, [role=menuitem]:visible, [role=menuitemcheckbox]:visible').allInnerTexts(); log(btnText + ' opts: ' + opts.join(' | ').slice(0, 800));
  const o = page.locator('[role=option]:visible, [role=menuitem]:visible, [role=menuitemcheckbox]:visible').filter({ hasText: opt }).first();
  if (await o.count()) { await o.click(); await sleep(3000); await page.keyboard.press('Escape'); await sleep(1500); await shot(name); const t = await text(); const i = t.indexOf('RECENT ACTIVITY'); log(name + ' TEXT ' + t.slice(i, i + 1500).replace(/\n/g, ' | ')); }
  else await page.keyboard.press('Escape');
};
await pick('All Entities', /^Module Configuration$/, 'C2-3-audit-module-config.png');
