await go('/settings/organization/customer-happiness', 10000);
const tx = (await page.locator('main').last().innerText()).replace(/\s+/g, ' '); out.has = tx.match(/.{0,80}(translat|download|import|export).{0,120}/gi);
out.btns = (await page.locator('main button, main a').allInnerTexts()).map(s => s.trim()).filter(s => /transl|download|import|export|upload|language/i.test(s));
await shot('w4/W4-79-page');
return fin({ out });
