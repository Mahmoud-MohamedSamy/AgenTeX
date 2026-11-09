const d = page.locator('[role=dialog]').first();
const i = d.locator('input[type=email]'); await i.fill('mmohamed@anyware.software'); await i.press('Enter'); await sleep(500);
const rq = page.waitForResponse(r => /export\/email|email/.test(r.url()) && r.request().method() === 'POST', { timeout: 30000 }).catch(() => null);
await d.locator('button', { hasText: /^Send$/ }).click();
const r = await rq; await sleep(3000);
await shot('s02-email-sent');
const body = (await page.innerText('body')).replace(/\s+/g, ' ');
return { req: r ? r.url().replace(/^.*\/api\/v1/, '') + ' ' + r.request().postData() : null, resp: r ? r.status() + ' ' + (await r.text()).slice(0, 400) : 'none', toast: (body.match(/[^.]{0,60}(sent|queued|email)[^.]{0,60}/gi) || []).slice(0, 4) };
