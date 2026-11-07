// NDC-2773 r12: invitation page (signed out) → Accept → Complete your registration: password hint rules, live check, digit-less password.
const st = {}; const reqs = []; require(require('path').join(process.cwd(), 'hook.js'))(page, reqs);
const TOK = process.env.TOK, TEN = process.env.TEN;
await page.goto(`${H}/invitation?token=${encodeURIComponent(TOK)}&tenant=${TEN}`, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Accept|Decline|invalid|expired/i.test(await text())) break; } await sleep(2000); await shot('2773-a1-invitation.png');
st.inv = (await text()).replace(/\s+/g, ' ').slice(0, 300);
await page.getByRole('button', { name: /Accept/ }).first().click(); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Complete your registration/i.test(await text())) break; } await sleep(2000);
await page.getByLabel(/First name/i).fill('QA'); await page.getByLabel(/Last name/i).fill('RT12 2773');
const pw = page.locator('input[type=password]').first(); await pw.click(); await sleep(1200); await shot('2773-a2-hint-empty.png');
st.hintEmpty = (await text()).match(/(At least[\s\S]{0,400})/)?.[1].split('\n').map(s => s.trim()).filter(Boolean).slice(0, 8);
await pw.fill('TempTestUser@'); await sleep(1500); await shot('2773-a3-no-digit.png');
st.ruleStates = await page.locator('li').evaluateAll(a => a.filter(l => /At least|digit|number|character|letter/i.test(l.innerText)).map(l => l.innerText.trim() + ' [' + (l.getAttribute('data-state') || l.getAttribute('aria-checked') || l.className.match(/(text-[a-z]+-\d+|met|unmet|valid|invalid|success|danger)/g)?.join(' ') || '') + ']'));
await page.locator('input[type=password]').nth(1).fill('TempTestUser@'); await sleep(800);
const btn = page.getByRole('button', { name: /Create account/i }); st.createEnabled = await btn.isEnabled(); await shot('2773-a4-before-create.png');
if (st.createEnabled) { await btn.click(); await sleep(5000); await shot('2773-a5-after-create.png'); st.afterCreate = ((await text()).match(/[^\n]*digit[^\n]*/gi) || []).slice(0, 4); st.stillOnForm = /Complete your registration/i.test(await text()); }
st.fieldErr = await page.locator('[id*=error], [role=alert], .text-destructive, [aria-live]').allInnerTexts().catch(() => []);
st.reqs = reqs.filter(x => /invit|regist/.test(x)).map(x => x.replace(/token[=":]+[^&" ]+/g, 'token=<r>').slice(0, 200)); return st;
