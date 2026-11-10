// Read-only: Activities, Team Feeds, Round Robin tab, a ticket page, plus API counts.
const out = {};
const calls = [];
page.on('response', async r => { try { const u = r.url(); if (!u.includes('/api/v1/') || /\/iam\/auth/.test(u) || r.request().method() !== 'GET') return;
  let n = null; try { const j = await r.json(); const a = Array.isArray(j) ? j : (j && (j.items || j.data || j.results || j.records)); n = Array.isArray(a) ? a.length + (j && j.total != null ? '/' + j.total : '') : null; } catch (e) { }
  calls.push(r.status() + ' ' + u.split('/api/v1')[1].split('?')[0] + (n != null ? ' [' + n + ']' : '')); } catch (e) { } });
const snap = async (label) => { await page.screenshot({ path: '../evidence/raw/' + label + '.png' }); out[label] = { url: page.url().replace(H, ''), api: [...new Set(calls.splice(0))].filter(c => !/sandboxes|tab-settings|crm\/status|settings\/resolved|send-as-email|settings\/hub|^200 \/modules \[/.test(c)).slice(0, 10) }; };
// Activities via top nav
await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 120000 }); await sleep(12000); calls.splice(0);
const nav = page.getByRole('link', { name: 'Activities', exact: true });
if (await nav.count()) { await nav.first().click(); } else { await page.locator('header button').filter({ hasText: '' }).nth(0).click().catch(() => {}); await page.getByText('Activities', { exact: true }).first().click({ timeout: 10000 }).catch(e => out.actErr = String(e.message).slice(0, 80)); }
await sleep(12000); await snap('02-activities');
// Team Feeds
await page.goto(H + '/team-feeds', { waitUntil: 'commit', timeout: 120000 }); await sleep(14000); await snap('11c-team-feeds');
// Round Robin tab
await page.goto(H + '/settings/automation/assignment-rules', { waitUntil: 'commit', timeout: 120000 }); await sleep(12000); calls.splice(0);
await page.getByText('Round Robin', { exact: true }).first().click({ timeout: 15000 }).catch(e => out.rrErr = String(e.message).slice(0, 80)); await sleep(8000); await snap('06-round-robin');
// A ticket page (view only)
await page.goto(H + '/views/all/tickets/9e0e4802-f8f4-4149-93b9-82a455bc110c', { waitUntil: 'commit', timeout: 120000 }); await sleep(15000); await snap('12-ticket-page');
out.ticketTabs = (await page.innerText('body').catch(() => '')).match(/(\d+\s+)?(CONVERSATION|RESOLUTION|TIME ENTRY|ATTACHMENT|PARENT-CHILD|ACTIVITY|APPROVAL|COMMENT[S]?|HISTORY)/gi);
out.buttons = await page.$$eval('button', bs => [...new Set(bs.map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(t => t && t.length < 30))].slice(0, 60));
return out;
