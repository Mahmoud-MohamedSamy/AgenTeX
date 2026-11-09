const o = {};
await page.locator('text=/^ADVANCED$/').first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1500);
o.adv = (await txt()).replace(/\s+/g, ' ').match(/ADVANCED.{0,900}/)?.[0];
o.shot = await shot('a9/tavi-status-adv');
o.routes = await page.evaluate(async () => { const s = [...document.scripts].map(x => x.src).filter(Boolean); const out = []; for (const u of s) { try { const t = await (await fetch(u)).text(); const m = t.match(/["'`]\/settings\/[a-z0-9\-\/]*status[a-z0-9\-\/]*["'`]/gi); if (m) out.push(...m); } catch (e) {} } return [...new Set(out)].slice(0, 20); });
return JSON.stringify(o);
