const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const ids = JSON.parse(require('fs').readFileSync('../out/ids.json', 'utf8'));
const R = {};
const btn = label => page.locator(`${P} button[aria-label="${label}"], ${P} button[title="${label}"]`).first();
const openPanel = async () => { if (!(await page.locator(P).count())) { await page.locator(L).click(); await sleep(1500); } };
const newChat = async () => { await openPanel(); if (await btn('New chat').count()) { await btn('New chat').click(); await sleep(1500); } };
const nReplies = () => page.locator('[data-testid="tia-reply"]').count();
const send = async msg => { const n = await nReplies(); const ta = page.locator(`${P} textarea`); await ta.fill(msg); await ta.press('Enter'); await page.waitForFunction(k => document.querySelectorAll('[data-testid="tia-reply"]').length > k && !document.querySelector('[data-testid="tia-thinking"]'), n, { timeout: 120000 }).catch(() => {}); await sleep(3000); return (await page.locator('[data-testid="tia-reply"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 900); };
const cardInfo = async () => { const c = page.locator(`${P} button`, { hasText: /^Confirm$/ }); return { confirm: await c.count(), cancel: await page.locator(`${P} button`, { hasText: /^Cancel$/ }).count() }; };
await go('/'); await sleep(3500); await newChat();
// N1-11 create card
R.n111a = await send('Create a lead QA TIA RT J01, company QA Co, Single Line Permission QA');
R.n111card = await cardInfo();
if (!R.n111card.confirm) { R.n111b = await send('Yes, prepare it for my confirmation'); R.n111card = await cardInfo(); }
await shot('N1-11-crm-create-card');
// N1-12 confirm
if (R.n111card.confirm) { await page.locator(`${P} button`, { hasText: /^Confirm$/ }).last().click(); await sleep(6000); R.n112 = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(-500); await shot('N1-12-crm-confirmed'); }
// N1-13 cancel
await newChat();
R.n113a = await send('Create a lead QA TIA RT J02, company QA Co, Single Line Permission QA');
R.n113card = await cardInfo();
if (!R.n113card.confirm) { R.n113b = await send('Yes, prepare it for my confirmation'); R.n113card = await cardInfo(); }
if (R.n113card.cancel) { await page.locator(`${P} button`, { hasText: /^Cancel$/ }).last().click(); await sleep(4000); R.n113 = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(-300); await shot('N1-13-crm-cancelled'); }
// N1-14 update card
await newChat();
R.n114a = await send('Change the lead source of QA TIA RT Lead to referral');
R.n114card = await cardInfo();
if (!R.n114card.confirm) { R.n114b = await send('Yes, prepare it for my confirmation'); R.n114card = await cardInfo(); }
await shot('N1-14-crm-update-card');
if (R.n114card.confirm) { await page.locator(`${P} button`, { hasText: /^Confirm$/ }).last().click(); await sleep(6000); R.n114 = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(-300); }
// N1-15 card after reload
await newChat();
R.n115a = await send('Create a lead QA TIA RT J03, company QA Co, Single Line Permission QA');
R.n115card = await cardInfo();
if (!R.n115card.confirm) { R.n115b = await send('Yes, prepare it for my confirmation'); R.n115card = await cardInfo(); }
await page.reload(); await sleep(6000); await openPanel(); await sleep(2000);
R.n115after = await cardInfo(); R.n115text = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(-400); await shot('N1-15-crm-card-after-reload');
if (R.n115after.cancel) { await page.locator(`${P} button`, { hasText: /^Cancel$/ }).last().click(); await sleep(3000); R.n115cancel = 'cancelled after reload'; }
return R;
