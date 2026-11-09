const o = {}; const G4 = '09503b2b-b122-4c1b-a512-072d41ffbd30', G1 = 'ee9ba485-3bb1-4294-b596-67817b6f4f31';
await page.goto(H + '/views/all/tickets/' + G4, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 50; i++) { await sleep(3000); if (/G4 agent share/.test(await text()) && /QA alt/.test(await text())) break; } await sleep(3000);
await shot('a1-agent-ticket-g4.png'); const t = await text(); o.g4 = { subject: /G4 agent share/.test(t), alt: /QA alt/.test(t), go: /QA go/.test(t), rate: /QA rate/.test(t), reply: /\bReply\b/.test(t) };
o.btns = await page.locator('button').evaluateAll(a => a.map(b => b.innerText.trim()).filter(x => /^QA |Reply|Comment|Assign/.test(x)).slice(0, 15));
// open the step
const alt = page.getByRole('button', { name: /QA alt/ }).first(); if (await alt.count()) { await alt.click(); await sleep(4000); await shot('a2-agent-alt-form.png'); o.form = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).slice(0, 600); await page.keyboard.press('Escape'); }
// My Transitions
const nav = page.getByText(/My Transitions/i).first(); o.myTrNav = await nav.count();
if (o.myTrNav) { await nav.click(); await sleep(8000); await shot('a3-agent-my-transitions.png'); o.myTr = ((await text()).match(/My Transitions[\s\S]{0,700}/) || [''])[0]; }
// ticket after it left the state
await page.goto(H + '/views/all/tickets/' + G1, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 30; i++) { await sleep(3000); if (/not found|access|permission|G1 user owner/i.test(await text())) break; } await sleep(3000);
await shot('a4-agent-g1-after.png'); o.g1After = ((await text()).match(/.{0,120}(not found|access|permission|don't have).{0,120}/i) || [''])[0]; o.g1SubjectVisible = /G1 user owner/.test(await text());
return o;
