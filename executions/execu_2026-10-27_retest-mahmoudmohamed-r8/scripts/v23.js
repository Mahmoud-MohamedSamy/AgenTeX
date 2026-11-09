const out = {}; await go('/notifications', 8000); for (let j = 0; j < 40 && !/otification/.test(await txt()); j++) await sleep(2000); await sleep(3000); await shot('v23-notifications');
out.top = (await txt()).split('\n').map(l => l.trim()).filter(l => l && l.length < 50).slice(0, 40);
const s = page.getByRole('button', { name: /Preferences|Settings/i }).or(page.getByRole('tab', { name: /Preferences|Settings/i })).first(); out.hasPrefs = await s.count();
if (out.hasPrefs) { await s.click(); for (let j = 0; j < 30 && !/mail|Email|Activity|Reminder/.test(await txt()); j++) await sleep(2000); await sleep(2000); await shot('v23-prefs'); }
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); out.rawKeys = t.filter(l => /^[a-z_]+\.[a-z_.*]+$/.test(l)).slice(0, 25);
out.labels = t.filter(l => /email|reminder|mass|salesiq|chat|opened|clicked|replied|received|bounced/i.test(l) && l.length < 60).slice(0, 40);
return done(out);
