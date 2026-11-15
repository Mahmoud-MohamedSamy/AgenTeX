await go('/settings/channels/help-center/users', 10000);
const row = page.locator('main').getByText('qa-gl-w5r-c1@example.com').first().locator('xpath=ancestor::*[.//*[contains(text(),"Invited")]][1]');
await row.hover(); await sleep(1000); out.hoverBtns = await row.locator('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()));
await row.getByText('QA GL W5R Contact').click(); await sleep(4000);
out.url = page.url().replace(H, ''); out.detail = (await page.locator('[role=dialog]').last().innerText().catch(async () => await mtxt())).replace(/\s+/g, ' ').slice(0, 800);
out.btns = await page.locator('[role=dialog] button, main button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean).slice(-25));
await shot('w5r/W5-08-hc-user-detail');
return fin({ out });
