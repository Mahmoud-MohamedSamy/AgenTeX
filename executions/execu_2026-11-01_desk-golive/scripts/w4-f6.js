await go('/settings/channels/web-forms', 10000);
await page.getByRole('button', { name: /^New advanced form/ }).click(); await sleep(4000);
out.url = page.url();
const t = (await txt()).replace(/\s+/g, ' '); out.t = t.slice(t.indexOf('Email Providers') + 15, t.indexOf('Email Providers') + 1500);
out.ctrls = await page.locator('main input, main button[aria-haspopup], main select, [role=dialog] input, [role=dialog] button[aria-haspopup]').evaluateAll(es => es.map(e => [e.tagName, e.id, e.getAttribute('type'), (e.innerText || e.value || '').trim().slice(0, 30)].join('|')));
await shot('w4/W4-33-new-adv');
return fin({ out });
