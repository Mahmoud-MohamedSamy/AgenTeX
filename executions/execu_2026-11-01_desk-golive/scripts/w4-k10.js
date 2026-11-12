const HOME = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
const EXP = '3f07f22d-1c3d-41c5-855a-fdaf330361dd', ART = '0f683d99-2d89-4846-ae0a-ed741692cc83';
const e = D((await api('GET', '/desk/kb/articles/' + EXP)).j); out.exp = e.status + ' expires_at=' + e.expires_at + ' now=' + new Date().toISOString();
const ctx = await page.context().browser().newContext(); const p = await ctx.newPage();
const PN = []; p.on('response', async r => { const m = r.request().method(); if (m !== 'GET' && !/events/.test(r.url())) { let t = ''; try { t = (await r.text()).slice(0, 200); } catch (x) {} PN.push(m + ' ' + r.url().replace(/hc1\.[\w.-]+/, 'HC').slice(-70) + ' ' + r.status() + ' ' + t); } });
await p.goto(HOME + 'kb/articles/qa-gl-w4-expiring', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); out.expPortal = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 160);
await p.goto(HOME + 'kb/articles/qa-gl-w4-article', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await p.getByRole('button', { name: /^Yes/ }).first().click().catch(e => out.yesErr = e.message.slice(0, 80)); await p.waitForTimeout(3000);
out.afterYes = (await p.innerText('main').catch(() => '')).replace(/\s+/g, ' ').match(/Was this article helpful.{0,140}/)?.[0];
const ins = p.locator('main input[type=text], main input:not([type]), main textarea, main input[type=email]');
out.cform = await ins.evaluateAll(es => es.map(e => e.tagName + '|' + (e.getAttribute('placeholder') || e.getAttribute('aria-label') || e.name)));
try { await p.locator('main textarea').first().fill('QA GL W4 portal comment, signed out.'); const nm = p.locator('main input').filter({ hasNot: p.locator('[type=email]') }); await p.getByLabel(/Your name/).fill('QA GL W4 visitor').catch(() => {}); await p.getByLabel(/Your email/).fill('mmohamed@anyware.software').catch(() => {}); await p.getByRole('button', { name: /^Post comment/ }).click(); await p.waitForTimeout(5000); } catch (x) { out.cErr = x.message.slice(0, 120); }
out.afterComment = (await p.innerText('main').catch(() => '')).replace(/\s+/g, ' ').match(/Comments.{0,300}/)?.[0];
await p.screenshot({ path: SHOT + '/w4/W4-68-portal-feedback.png', fullPage: true });
out.PN = PN; await ctx.close();
const a = D((await api('GET', '/desk/kb/articles/' + ART)).j); out.counts = 'views=' + a.view_count + ' likes=' + a.like_count + ' dislikes=' + a.dislike_count + ' comments=' + a.comment_count;
const cm = await api('GET', '/desk/kb/articles/' + ART + '/comments'); out.comments = cm.s + ' ' + cm.t.slice(0, 300);
return fin({ out });
