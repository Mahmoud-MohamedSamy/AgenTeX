const o = {}; const TK = '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5';
await page.goto(H + '/views/all/tickets/' + TK, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000);
o.shot1 = await shot('../wave2n/r-split-ticket');
const more = page.locator('main button[aria-haspopup], [aria-label*="More" i], [aria-label*="actions" i]');
o.moreCount = await more.count();
// the message kebab is the last "more" on the conversation card
const msgMenu = page.locator('text=First question').locator('xpath=ancestor::*[.//button][1]').locator('button').last();
await msgMenu.click().catch(e => o.e1 = String(e).slice(0, 120)); await sleep(2500);
o.menu = (await page.locator('[role=menu], [role=menuitem]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 400);
o.shot2 = await shot('../wave2n/r-split-menu');
return done(o);
