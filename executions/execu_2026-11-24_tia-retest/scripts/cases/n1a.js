const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const ids = JSON.parse(require('fs').readFileSync('../out/ids.json', 'utf8'));
const LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const R = {};
// N1-01 launcher on pages
const pages = { home: '/', leads: '/modules/' + LEADS, lead: `/modules/${LEADS}/records/${ids.lead}`, settings: '/settings' };
R.n101 = {};
for (const [k, p] of Object.entries(pages)) { await go(p); await sleep(3500); R.n101[k] = await page.locator(L).count(); if (k === 'lead') await shot('N1-01-crm-lead-launcher'); }
// N1-02 setup page
await go('/settings/integrations/tia'); await sleep(6000);
const st = await text(); await shot('N1-02-crm-setup', { fullPage: true });
R.n102 = { url: page.url().replace(/[?#].*/, ''), has: ['Deployed', 'Edit', 'Deploy changes', 'Deactivate', 'Tia switch', 'Workspace allowance', 'Who can use Tia', 'Apps'].map(w => w + ':' + st.includes(w)).join(' '), deployDisabled: await page.locator('button', { hasText: 'Deploy changes' }).first().isDisabled().catch(() => 'n/a'), snippet: st.replace(/\s+/g, ' ').slice(0, 900) };
// N1-03 menu entries
await go('/settings'); await sleep(3000);
const menu = await text();
R.n103 = { tiaAssistant: menu.includes('Tia Assistant'), tiaLines: menu.split('\n').filter(l => /^\s*Tia( Assistant)?\s*$/.test(l)).length, aiLinks: (await page.locator('a').evaluateAll(as => as.filter(a => /ai|tia/i.test(a.innerText) && a.innerText.length < 40).map(a => a.innerText.trim() + ' -> ' + a.getAttribute('href')))) };
await shot('N1-03-crm-settings-menu', { fullPage: true });
// N1-04 AI Features page
const aiHref = R.n103.aiLinks.map(s => s.split(' -> ')).find(([t]) => /AI Features|AI features/i.test(t));
if (aiHref) { await go(aiHref[1]); await sleep(5000); const at = await text(); await shot('N1-04-crm-ai-features', { fullPage: true });
  const sw = await page.locator('[role=switch], input[type=checkbox]').evaluateAll(els => els.map(e => ({ label: (e.getAttribute('aria-label') || e.closest('label,div')?.innerText || '').replace(/\s+/g, ' ').slice(0, 80), on: e.getAttribute('aria-checked') ?? e.checked })));
  R.n104 = { href: aiHref[1], tiaRow: at.split('\n').filter(l => /tia/i.test(l)).slice(0, 6), switches: sw.filter(s => /tia/i.test(s.label)).slice(0, 5), allCount: sw.length };
} else R.n104 = { notFound: true };
// N1-05 open/minimise/close
await go('/'); await sleep(3000);
await page.locator(L).click(); await sleep(2000);
R.n105 = { open: await page.locator(P).count(), focus: await page.evaluate(() => document.activeElement?.tagName + ' ' + (document.activeElement?.getAttribute('aria-label') || '')) };
const names = await page.$$eval(`${P} button`, b => b.map(x => x.getAttribute('aria-label') || x.title || x.innerText.trim()).filter(Boolean));
R.n105.buttons = names.slice(0, 15);
const btn = label => page.locator(`${P} button[aria-label="${label}"], ${P} button[title="${label}"]`).first();
// N1-07 new chat welcome + suggestions
if (await btn('New chat').count()) { await btn('New chat').click(); await sleep(1500); }
await shot('N1-07-crm-new-chat');
R.n107 = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 800);
if (await btn('Minimise').count()) { await btn('Minimise').click(); await sleep(1200); R.n105.afterMin = { panel: await page.locator(P).isVisible().catch(() => false), launcher: await page.locator(L).count() }; await page.locator(L).click(); await sleep(1500); R.n105.reopened = await page.locator(P).isVisible().catch(() => false); }
if (await btn('Close').count()) { await btn('Close').click(); await sleep(1000); R.n105.afterClose = { panel: await page.locator(P).count(), launcher: await page.locator(L).count(), focus: await page.evaluate(() => document.activeElement?.getAttribute('data-testid') || document.activeElement?.tagName) }; }
// N1-06 drag + reload
await page.locator(L).click(); await sleep(1500);
const hdr = page.locator('[data-testid="tia-panel-header"]'); const b0 = await page.locator(P).boundingBox();
const hb = await hdr.boundingBox(); await page.mouse.move(hb.x + 40, hb.y + hb.height / 2); await page.mouse.down(); await page.mouse.move(hb.x - 300, hb.y + 120, { steps: 12 }); await page.mouse.up(); await sleep(800);
const b1 = await page.locator(P).boundingBox();
const ls1 = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => /tia/i.test(k)).map(k => [k, localStorage.getItem(k)])));
await page.reload(); await sleep(5000); if (!(await page.locator(P).count())) { await page.locator(L).click(); await sleep(1500); }
const b2 = await page.locator(P).boundingBox();
R.n106 = { before: b0 && [Math.round(b0.x), Math.round(b0.y)], afterDrag: b1 && [Math.round(b1.x), Math.round(b1.y)], afterReload: b2 && [Math.round(b2.x), Math.round(b2.y)], ls: ls1 };
await shot('N1-06-crm-position-after-reload');
// N1-08 suggestions on the lead and a report
await go(pages.lead); await sleep(4000); if (!(await page.locator(P).count())) { await page.locator(L).click(); await sleep(1500); }
if (await btn('New chat').count()) { await btn('New chat').click(); await sleep(1500); }
R.n108lead = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 500); await shot('N1-08-crm-lead-suggestions');
return R;
