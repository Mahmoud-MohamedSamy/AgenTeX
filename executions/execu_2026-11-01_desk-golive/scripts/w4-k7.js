const HOME = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
const ctx = await page.context().browser().newContext(); const p = await ctx.newPage();
const search = async q => { await p.goto(HOME + 'kb', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); const box = p.locator('input[type=search]').first(); await box.fill(q); await box.press('Enter'); await p.waitForTimeout(6000); return p.url().replace(/hc1\.[\w.-]+/, 'HC').slice(-60) + ' :: ' + (await p.innerText('main').catch(() => p.innerText('body'))).replace(/\s+/g, ' ').slice(0, 220); };
out.sZebra = await search('zebrafish42'); out.sAr = await search('زرافة٩٩'); out.sDraft = await search('quokka77'); out.sHidden = await search('narwhal55'); out.sAgents = await search('pangolin66'); out.sExp = await search('axolotl33');
await p.screenshot({ path: SHOT + '/w4/W4-67-search.png' });
// hidden article direct URL
await p.goto(HOME + 'kb/articles/qa-gl-w4-hidden', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); out.hiddenDirect = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 150);
await p.goto(HOME + 'kb/articles/qa-gl-w4-draft', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); out.draftDirect = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 150);
await p.goto(HOME + 'kb/articles/qa-gl-w4-agents-only', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); out.agentsDirect = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 150);
await p.goto(HOME + 'kb/articles/qa-gl-w4', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); out.arDir = await p.locator('main p').first().evaluate(e => e.getAttribute('dir') + '/' + getComputedStyle(e).direction).catch(() => '?');
await ctx.close();
const a = arr(D((await api('GET', '/desk/kb/articles?limit=50')).j)); out.exp = a.filter(x => /expiring/.test(x.title)).map(x => x.status + ' ' + x.expires_at + ' now ' + new Date().toISOString());
return fin({ out });
