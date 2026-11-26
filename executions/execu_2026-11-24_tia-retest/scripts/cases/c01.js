const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const ids = JSON.parse(require('fs').readFileSync('../out/ids.json', 'utf8'));
const R = { turns: [] };
const btn = label => page.locator(`${P} button[aria-label="${label}"]`).first();
const openPanel = async () => { if (!(await page.locator(P).count())) { await page.locator(L).click(); await sleep(1500); } };
const newChat = async () => { await openPanel(); if (await btn('New chat').count()) { await btn('New chat').click(); await sleep(1500); } };
const nReplies = () => page.locator('[data-testid="tia-reply"]').count();
const waitNew = async n => { await page.waitForFunction(k => document.querySelectorAll('[data-testid="tia-reply"]').length > k && !document.querySelector('[data-testid="tia-thinking"]'), n, { timeout: 120000 }).catch(() => {}); await sleep(3000); };
const last = async () => (await page.locator('[data-testid="tia-reply"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 700);
const hasCard = async () => page.locator(`${P} button`, { hasText: /^Confirm$/ }).count();
const send = async msg => { const n = await nReplies(); const ta = page.locator(`${P} textarea`); await ta.fill(msg); await ta.press('Enter'); await waitNew(n); const t = await last(); R.turns.push({ msg, t, card: await hasCard() }); return t; };
await go('/views/all/tickets/' + ids.t1); await sleep(7000);
await newChat();
R.suggestions = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 400);
// C-01: click the suggestion
const s = page.locator(`${P} button`, { hasText: 'Draft a private comment' });
R.sugCount = await s.count();
if (R.sugCount) { const n = await nReplies(); await s.first().click(); await waitNew(n); R.turns.push({ msg: '[suggestion] Draft a private comment', t: await last(), card: await hasCard() }); }
let pushes = 0;
while (!(await hasCard()) && pushes < 3) { pushes++; await send(pushes === 1 ? 'you suggest the text' : 'yes, prepare it for my confirmation'); }
R.c01messagesToCard = (await hasCard()) ? (R.sugCount ? 1 : 0) + pushes : null;
await shot('C-01-NDC-3246-suggestion');
if (await hasCard()) { R.cardText = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(-600); await page.locator(`${P} button`, { hasText: /^Confirm$/ }).last().click(); await sleep(6000); R.c01confirm = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(-300); }
const c01turns = R.turns.length;
// C-02: typed path
await newChat();
await send('draft a private comment on this ticket');
await send('you suggest a private comment');
if (!(await hasCard())) await send('go ahead');
R.c02cardAt = (await hasCard()) ? R.turns.length - c01turns : null;
await shot('C-02-NDC-3246-typed');
if (await hasCard()) { await page.locator(`${P} button`, { hasText: /^Cancel$/ }).last().click(); await sleep(3000); R.c02 = 'card shown, cancelled'; }
return R;
