// UI helpers, in scope for every u*.js step (t2.sh wraps them). page = TAVI tab.
const EV = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
const HOST = 'https://staging-' + (globalThis.__APP || 'crm') + '.taviportal.com';
const sleep = ms => page.waitForTimeout(ms);
const dialogs = []; if (!page.__dlg) { page.__dlg = true; page.on('dialog', d => { (page.__dialogs = page.__dialogs || []).push(d.message()); d.dismiss().catch(() => {}); }); }
let openCreate = async (mid, lid, extra = '') => { await page.goto(HOST + '/modules/' + mid + '/records/new?layout=' + lid + extra, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field]', { timeout: 30000 }).catch(() => {}); await sleep(2500); };
let openRec = async (mid, id) => { await page.goto(HOST + '/modules/' + mid + '/records/' + id, { waitUntil: 'domcontentloaded' }); await sleep(7000); };
const wrap = f => page.locator(`[data-rule-field="${f}"]`).first();
// visible = wrapper exists and is rendered (offsetParent / bounding box)
const vis = async f => page.evaluate(f => { const w = document.querySelector(`[data-rule-field="${f}"]`); if (!w) return false; const r = w.getBoundingClientRect(); const st = getComputedStyle(w); return r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden'; }, f);
const visMany = async fs => { const o = {}; for (const f of fs) o[f] = await vis(f); return o; };
const secVis = async label => page.evaluate(l => { const h = [...document.querySelectorAll('h2,h3,h4,button,div,span')].find(e => e.childElementCount === 0 && e.innerText && e.innerText.trim() === l); if (!h) return false; const r = h.getBoundingClientRect(); return r.height > 0; }, label);
const isReq = async f => page.evaluate(f => { const w = document.querySelector(`[data-rule-field="${f}"]`); if (!w) return null; const t = w.innerText; const c = w.querySelector('input,textarea,button[role=combobox]'); return /\*/.test((w.querySelector('label') || {}).innerText || '') || !!(c && (c.required || c.getAttribute('aria-required') === 'true')) || /required/i.test(w.querySelector('label')?.className || ''); }, f);
const isRO = async f => page.evaluate(f => { const w = document.querySelector(`[data-rule-field="${f}"]`); if (!w) return null; const c = w.querySelector('input,textarea,button[role=combobox]'); return !!(c && (c.disabled || c.readOnly || c.getAttribute('aria-readonly') === 'true' || c.getAttribute('aria-disabled') === 'true')); }, f);
const valOf = async f => page.evaluate(f => { const w = document.querySelector(`[data-rule-field="${f}"]`); if (!w) return null; const c = w.querySelector('input,textarea'); if (c) return c.type === 'checkbox' ? c.checked : c.value; const v = w.querySelector('[id$="-value"]'); return v ? v.innerText.trim() : w.innerText.trim(); }, f);
const pick = async (f, value) => { await wrap(f).locator('button[role=combobox]').first().click(); await sleep(600); const opt = page.getByRole('option', { name: value, exact: true }); if (await opt.count()) await opt.first().click(); else await page.locator('[role=listbox] >> text="' + value + '"').first().click(); await sleep(900); };
const options = async f => { await wrap(f).locator('button[role=combobox]').first().click(); await sleep(600); const o = await page.getByRole('option').allInnerTexts(); await page.keyboard.press('Escape'); await sleep(300); return o.map(s => s.trim()); };
const typeIn = async (f, text) => { const i = wrap(f).locator('input,textarea').first(); await i.fill(''); await i.fill(String(text)); await i.press('Tab').catch(() => {}); await sleep(700); };
const tick = async (f, on = true) => { const c = wrap(f).locator('input[type=checkbox], button[role=checkbox], button[role=switch]').first(); const cur = await c.evaluate(e => e.checked ?? e.getAttribute('aria-checked') === 'true'); if (cur !== on) await c.click(); await sleep(800); };
const save = async () => { const b = page.getByRole('button', { name: /^Save$/ }).last(); await b.click(); await sleep(3500); };
const bodyText = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
const errs = async () => page.evaluate(() => [...document.querySelectorAll('[role=alert], .text-red-600, .text-danger, [data-error], [aria-invalid=true]')].map(e => (e.innerText || e.getAttribute('name') || e.id || '').trim()).filter(Boolean).slice(0, 10));
const shot = async (n, full = true) => { await page.screenshot({ path: EV + n + '.png', fullPage: full }); return n; };
const api = async (m, p, b) => page.evaluate(async ({ m, p, b }) => { const r = await fetch('/api/v1' + p, { method: m, headers: { 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined, credentials: 'include' }); return { s: r.status, t: (await r.text()).slice(0, 3000) }; }, { m, p, b });
// re-sign-in the browser if a page shows the login form (uses the server's own U/PW; never printed)
const relogin = async () => { if (!(await page.getByText('Forgot password?').count())) return false; const em = page.locator('input[type=email], input[name=email]').first(); if (await em.count()) { await em.fill(U); if (!(await page.locator('input[type=password]').count())) await page.keyboard.press('Enter'); await page.waitForSelector('input[type=password]', { timeout: 30000 }); await page.locator('input[type=password]').fill(PW); await page.keyboard.press('Enter'); await page.waitForTimeout(8000); } return true; };
const _oc = openCreate, _or = openRec;
openCreate = async (...a) => { await _oc(...a); if (await relogin()) await _oc(...a); };
openRec = async (...a) => { await _or(...a); if (await relogin()) await _or(...a); };
