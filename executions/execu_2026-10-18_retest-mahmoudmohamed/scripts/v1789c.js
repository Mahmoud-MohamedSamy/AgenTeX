const out = { reqs: [] };
const fr = r => { const u = decodeURIComponent(r.url()); if (/\/records\?/.test(u)) out.reqs.push(u.replace(API, '').slice(0, 330)); }; page.on('request', fr);
await openWQ(); await pick(/^Tasks, /); await sleep(6000);
await shot('NDC-1789-check-tasks'); out.funnel = await badge(); out.main = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 400);
page.off('request', fr); return done(out);
