const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const res = {}; const seen = [];
await ctx.route(/\/api\/v1\/modules\/[^/]+\/blueprints/, async r => { const m = r.request().method(); if (m === 'GET') return r.continue(); const pd = r.request().postData() || ''; seen.push({ m, url: r.request().url().split('/api/v1')[1].slice(0, 120), keys: (() => { try { return Object.keys(JSON.parse(pd)); } catch (e) { return pd.slice(0, 80); } })(), rev: (() => { try { return JSON.parse(pd).revision; } catch (e) { return '?'; } })(), isActive: (() => { try { return JSON.parse(pd).isActive; } catch (e) { return '?'; } })() }); await r.abort(); });
await page.goto(H + '/settings/automation/blueprints', { waitUntil: 'domcontentloaded' }); await sleep(10000);
const nm = page.getByText('QA BP RT19 D3 3070 renamed by A', { exact: true }).first();
const card = nm.locator('xpath=ancestor::*[.//button[@role="switch"] or .//input[@type="checkbox"] or .//*[@role="switch"]][1]');
res.cardN = await card.count();
const sw = card.locator('[role=switch], input[type=checkbox]').first(); res.swN = await card.locator('[role=switch], input[type=checkbox]').count();
await nm.scrollIntoViewIfNeeded(); await sleep(500);
const bb = await sw.boundingBox().catch(() => null); res.bb = bb;
if (res.swN) { await sw.click({ force: true }); await sleep(4000); }
await page.screenshot({ path: RAW + '3070-2-list-switch-blocked.png' });
res.seen = seen; res.msg = (await text()).replace(/\s+/g, ' ').match(/.{0,100}(error|failed|could not|Couldn|went wrong).{0,100}/i)?.[0] || '';
return res;
