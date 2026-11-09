const o = {}; const waitText = async (re, n) => { for (let i = 0; i < (n || 60); i++) { await sleep(1500); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/views/all/tickets/e12a0baa-459b-48fa-b5c8-bcaad81a5621', { waitUntil: 'commit', timeout: 120000 }).catch(() => {}); await waitText(/QA NDC smoke MI layout given/, 80); await sleep(3000);
const pane = page.locator('text=/QA NDC Agent id/').first(); if (await pane.count()) { await pane.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1200); }
o.detail = await shot('a6/tavi-895-detail');
o.detailText = (await txt()).replace(/\s+/g, ' ').match(/QA NDC Agent id.{0,400}/)?.[0];
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=602826bb-1d89-4aaf-82a9-1ab5e469c628', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
await waitText(/Create Ticket|QA NDC Agent id/, 80); await sleep(3000);
o.formText = (await txt()).replace(/\s+/g, ' ').slice(0, 900); o.form = await shot('a6/tavi-create-form');
const subj = page.locator('xpath=//*[normalize-space(text())="Subject"]/ancestor::*[self::div][2]//input').first(); o.subj = await subj.count(); if (o.subj) await subj.fill('QA NDC smoke UI required missing');
const save = page.locator('button', { hasText: /^Save$/ }).last(); o.save = await save.count(); if (o.save) await save.click().catch(e => o.saveErr = e.message.slice(0, 80));
let t = ''; for (let i = 0; i < 20; i++) { await sleep(1000); t = await txt(); if (/\/records\/[0-9a-f-]{36}/.test(page.url())) break; }
o.afterUrl = page.url().replace(H, ''); o.msgs = (t.match(/[^.\n]{0,60}(is required|required|Please)[^.\n]{0,60}/gi) || []).slice(0, 12);
o.after = await shot('a6/tavi-create-after');
return JSON.stringify(o);
