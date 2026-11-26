await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(3000);
const r = await page.locator('[data-testid="tia-areas-card"] input[type=checkbox]').evaluateAll(els => els.map(e => ({ l: e.getAttribute('aria-label') || '', c: e.checked, d: e.disabled })));
const prop = r.filter(x => /^Propose/i.test(x.l));
await shot('PA-propose-all', { fullPage: true });
return { proposeBoxes: prop.length, checked: prop.filter(x => x.c).length, unchecked: prop.filter(x => !x.c).map(x => x.l).slice(0, 10), disabled: prop.filter(x => x.d).length, notLive: (await text()).includes('not live yet') };
