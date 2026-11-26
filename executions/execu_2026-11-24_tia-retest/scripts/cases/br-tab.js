const P = '[data-testid="tia-panel"]'; await go('/'); await sleep(6000); await page.locator('[data-testid="tia-launcher"]').first().click(); await sleep(2500);
await page.locator(`${P} textarea`).first().click(); await page.keyboard.type('abc');
const seq = []; for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(sel => { const a = document.activeElement; return (document.querySelector(sel)?.contains(a) ? 'in:' : 'OUT:') + (a?.getAttribute('aria-label') || a?.tagName || ''); }, P)); }
const val = await page.locator(`${P} textarea`).first().inputValue(); const back = []; for (let i = 0; i < 3; i++) { await page.keyboard.press('Shift+Tab'); back.push(await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName)); }
return { seq, textareaValue: JSON.stringify(val), shiftTab: back };
