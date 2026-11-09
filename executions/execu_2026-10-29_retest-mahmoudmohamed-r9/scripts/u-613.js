// NDC-613 screen (U1 with view self/team/all denied, export granted): Settings has no Login History link; the direct URL does not open the page.
await page.goto(H + '/settings', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
const s = await text(); await shot('613-settings.png');
await page.goto(H + '/settings/security/login-history', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
const d = await text(); await shot('613-direct-url.png');
const exportBtn = await page.$('button:has-text("Export")');
return { settingsHasLoginHistory: /Login History/i.test(s), securitySection: (s.match(/Security Control.{0,300}/s) || [''])[0].replace(/\s+/g, ' ').slice(0, 300), direct: d.replace(/\s+/g, ' ').slice(0, 50) + ' … ' + (d.match(/.{0,80}(access|permission|not allowed|no access|login history).{0,120}/i) || [''])[0].replace(/\s+/g, ' '), url: page.url(), exportButton: !!exportBtn };
