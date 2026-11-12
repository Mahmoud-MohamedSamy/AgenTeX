async (page) => {
  const EVd = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/';
  const box = await page.locator('#ajaxEdit_INDUSTRY').boundingBox().catch(() => null);
  // the save tick sits right of the dropdown
  const ticks = page.locator('[data-zcqa*="save" i]:visible, .ajaxEditSave:visible, [aria-label*="Save" i]:visible');
  let clicked = 'none'; if (await ticks.count()) { await ticks.first().click(); clicked = 'tick'; } else { await page.keyboard.press('Enter'); clicked = 'enter'; }
  await page.waitForTimeout(3500);
  await page.screenshot({ path: EVd + 'zoho-G4-after-save.png' });
  const dlg = page.locator('[role=dialog]:visible, .lyteModal:visible, lyte-modal:visible, .lyteWormhole:visible');
  return { clicked, dlg: (await dlg.count()) ? (await dlg.first().innerText()).replace(/\s+/g, ' ').slice(0, 500) : '', faxNow: (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,120}Fax.{0,160}/)?.[0] };
}
