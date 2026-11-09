const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const BH = '/iam/tenant/business-hours/profiles'; const id = '8594d6e4-0eb6-4060-8333-751080e52068'; const o = {};
const d = ['mon', 'tue', 'wed', 'thu', 'fri'];
const spd = { mon: [{ open: '09:00', close: '13:00' }, { open: '14:00', close: '18:00' }], tue: [{ open: '22:00', close: '02:00' }], wed: [{ open: '09:00', close: '17:00' }], thu: [{ open: '09:00', close: '17:00' }], fri: [{ open: '09:00', close: '17:00' }] };
const hpd = Object.fromEntries(d.map(k => [k, spd[k][0]]));
let r = await api('PUT', BH + '/' + id, { name: 'QA GL BH', preset: 'custom', days_active: d, timing_mode: 'different', hours: null, hours_per_day: hpd, slots: null, slots_per_day: spd, week_starts_on: 'sun', time_zone: 'Africa/Cairo' });
o.overnight = S(r);
const spd2 = { ...spd, tue: [{ open: '09:00', close: '17:00' }] }; const hpd2 = Object.fromEntries(d.map(k => [k, spd2[k][0]]));
r = await api('PUT', BH + '/' + id, { name: 'QA GL BH', preset: 'custom', days_active: d, timing_mode: 'different', hours: null, hours_per_day: hpd2, slots: null, slots_per_day: spd2, week_starts_on: 'sun', time_zone: 'Africa/Cairo' });
o.multiBlock = S(r); const g = await api('GET', BH + '/' + id); o.monSlots = JSON.stringify(g.j && g.j.data && g.j.data.slots_per_day && g.j.data.slots_per_day.mon);
// UI: list shows summary + default row actions
await go('/settings/organization/business-hours', 15000); const t = await txt();
o.ui = { hasQA: t.includes('QA GL BH'), summary: (t.match(/QA GL BH[^\n]*\n?[^\n]*\n?[^\n]*/) || [''])[0].replace(/\s+/g, ' ').slice(0, 160) };
// open default row menu
const btns = await page.$$('button[aria-label^="Actions for"]'); o.ui.menuButtons = btns.length;
if (btns.length) { await btns[0].click(); await sleep(1500); o.ui.defaultMenu = (await page.$$eval('[role=menuitem]', ms => ms.map(m => m.innerText.trim() + (m.getAttribute('aria-disabled') === 'true' || m.hasAttribute('data-disabled') ? '(disabled)' : '')))).join(' | '); await page.keyboard.press('Escape'); }
return done(o);
