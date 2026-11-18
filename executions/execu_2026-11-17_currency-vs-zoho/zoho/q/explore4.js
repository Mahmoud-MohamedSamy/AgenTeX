async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const grab = async (x, y, name) => {
    const before = await page.innerText('body');
    await page.mouse.click(x, y); await page.waitForTimeout(1500);
    const items = await page.locator('lyte-drop-item:visible, li:visible[role=option], .cxDropdownItem:visible').allInnerTexts();
    await page.screenshot({ path: R + 'z10-' + name + '.png' });
    await page.keyboard.press('Escape'); await page.waitForTimeout(800);
    return items.map(s => s.trim()).filter(Boolean).slice(0, 20);
  };
  out.code = await grab(884, 204, 'code');
  out.position = await grab(884, 258, 'position');
  out.sep = await grab(884, 312, 'sep');
  out.dec = await grab(884, 366, 'dec');
  const t = await page.innerText('body'); out.stillOpen = /Add Currency\nCurrency/.test(t) || t.includes('Save and New');
  return out;
}
