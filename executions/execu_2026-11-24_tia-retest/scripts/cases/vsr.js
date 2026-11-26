// Virtual screen reader (Guidepup) over the Tia panel: what is spoken while browsing, sending, answering and on a card.
const fs = require('fs'); const INJ = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/969290c9-9e55-4b0e-8f74-631764dcb62a/scratchpad/vsr/vsr-inject.js';
const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
await go('/'); await sleep(6000);
await page.evaluate(fs.readFileSync(INJ, 'utf8')); R.loaded = await page.evaluate(() => !!window.__guidepup?.virtual);
// launcher as announced
R.launcher = await page.evaluate(async sel => { const v = window.__guidepup.virtual; await v.start({ container: document.querySelector(sel).parentElement }); for (let i = 0; i < 3; i++) await v.next(); const l = await v.spokenPhraseLog(); await v.stop(); return l.slice(0, 6); }, L);
await page.locator(L).first().click(); await sleep(2500);
const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1200); }
// start reading the whole document so live regions anywhere are heard
await page.evaluate(async () => { await window.__guidepup.virtual.start({ container: document.body }); });
const logLen = async () => page.evaluate(async () => (await window.__guidepup.virtual.spokenPhraseLog()).length);
const newPhrases = async from => page.evaluate(async f => (await window.__guidepup.virtual.spokenPhraseLog()).slice(f), from);
const send = async m => { const n = await page.locator('[data-testid="tia-reply"]').count(); const ta = page.locator(`${P} textarea`).first(); await ta.fill(m); await ta.press('Enter'); await page.waitForFunction(k => document.querySelectorAll('[data-testid="tia-reply"]').length > k && !document.querySelector('[data-testid="tia-thinking"]'), n, { timeout: 120000 }).catch(() => {}); await sleep(3000); };
let f = await logLen(); await send('How many deals are there?'); R.spokenDuringAnswer = (await newPhrases(f)).slice(0, 15);
// browse the panel with the reader (like pressing the down arrow)
R.browsePanel = await page.evaluate(async sel => { const v = window.__guidepup.virtual; await v.stop(); await v.start({ container: document.querySelector(sel) }); for (let i = 0; i < 30; i++) await v.next(); const l = await v.spokenPhraseLog(); await v.stop(); return l; }, P);
await page.evaluate(async () => { await window.__guidepup.virtual.start({ container: document.body }); }); f = await logLen();
await send('Create a lead with first name "QA TIA VSR card" and last name "Reader". Prepare the card for me to confirm.'); R.spokenDuringCard = (await newPhrases(f)).slice(0, 15);
R.browseCard = await page.evaluate(async sel => { const v = window.__guidepup.virtual; await v.stop(); const cards = document.querySelector(sel); await v.start({ container: cards }); const out = []; for (let i = 0; i < 60; i++) { await v.next(); } const l = await v.spokenPhraseLog(); await v.stop(); return l.slice(-28); }, P);
const rej = page.locator(`${P} button`, { hasText: /^(Cancel|Reject)$/ }); if (await rej.count()) { await rej.last().click(); await sleep(2000); R.rejected = true; }
await shot('VSR-card');
return R;
