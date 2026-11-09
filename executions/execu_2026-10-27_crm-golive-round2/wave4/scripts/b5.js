// Round 2 Wave 4 batch 5 (owner session, read-only screens): reminder notification, Signals prefs, calendar, web forms, SMS, templates.
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/wave4/evidence/raw/';
const HOST = 'https://staging-crm.taviportal.com';
const out = { now: new Date().toISOString() };
// reminder delivered?
const n = await call('GET', '/notifications?limit=50');
const items = (n.j && n.j.data && (n.j.data.data || n.j.data.items || n.j.data)) || [];
out.notif = n.s; out.reminders = items.filter(x => /reminder/.test(x.event_type) || /QA R2W4/.test(JSON.stringify(x))).map(x => x.event_type + ' | ' + x.title + ' | ' + x.created_at).slice(0, 8);
const shot = async (p, name, wait) => { await page.goto(HOST + p, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {}); let t = ''; for (let i = 0; i < (wait || 30); i++) { await page.waitForTimeout(1000); t = await page.innerText('main').catch(() => page.innerText('body').catch(() => '')); if (t.length > 80 && !/Loading/.test(t)) break; } await page.waitForTimeout(1500); await page.screenshot({ path: RAW + name + '.png' }); return t.replace(/\s+/g, ' ').slice(0, 900); };
out.signals = await shot('/settings/notifications/preferences', 't-signals', 40);
out.signalsRawKeys = (out.signals.match(/[a-z_]+\.[a-z_]+(\.[a-z_*]+)+/g) || []).slice(0, 20);
out.bell = await (async () => { await page.goto(HOST + '/', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000); const b = page.getByRole('button', { name: /notification/i }).first(); if (await b.count()) { await b.click().catch(() => {}); await page.waitForTimeout(4000); await page.screenshot({ path: RAW + 't-bell.png' }); return (await page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); } return 'no bell button'; })();
out.calendarMonth = await shot('/calendar', 't-calendar', 30);
for (const v of ['Day', 'Week', 'Month']) { const b = page.getByRole('button', { name: new RegExp('^' + v + '$') }).first(); if (await b.count()) { await b.click().catch(() => {}); await page.waitForTimeout(3000); await page.screenshot({ path: RAW + 't-calendar-' + v.toLowerCase() + '.png' }); out['cal' + v] = (await page.innerText('main').catch(() => '')).replace(/\s+/g, ' ').slice(0, 250); } }
out.webForms = await shot('/settings/web-forms', 't-web-forms', 30);
out.sms = await shot('/settings/sms', 't-sms', 30);
out.templates = await shot('/settings/integrations/email-templates', 't-email-templates', 30);
out.templateFolders = /folder/i.test(out.templates);
out.emailIntegrations = await shot('/settings/integrations/email', 't-email-integrations', 30);
out.reminderSettings = await shot('/settings/activity-reminders', 't-activity-reminders', 30);
return out;
