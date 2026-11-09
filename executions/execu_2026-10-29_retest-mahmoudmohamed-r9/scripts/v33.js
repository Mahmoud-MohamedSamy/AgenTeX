const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', id = 'e8e8c1dd-8468-4199-8f7c-db017aeebd02'; const out = {};
await page.setViewportSize({ width: 1600, height: 900 }); await go(`/modules/${L}/records/${id}`, 6000);
for (let j = 0; j < 45 && !/QA RT r8 attach/.test(await txt()); j++) await sleep(2000); await sleep(8000);
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean);
out.hasAttachments = t.some(l => /^Attachments/.test(l)); out.hasSurvey = t.some(l => /Survey/.test(l));
out.sections = t.filter(l => /^[A-Z][A-Za-z ]+( \(\d+\))?$/.test(l) && l.length < 30).slice(25, 70);
await shot('v33-wt-lead'); return done(out);
