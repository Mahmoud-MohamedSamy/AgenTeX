const o = {};
await page.goto(H + '/settings/automation/workflow-rules/db53138c-eca9-4f03-a463-824efb2f26b6', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(1500); const t = await txt(); if (/WHEN/.test(t) && /Close Ticket/.test(t)) break; }
await sleep(4000); await page.locator("text=/This rule will be executed/").first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(8000);
o.t = (await txt()).replace(/\s+/g, ' ').match(/EXECUTE BASED ON.{0,700}/)?.[0];
o.shot = await shot('rt/2793-closeticket');
return JSON.stringify(o);
