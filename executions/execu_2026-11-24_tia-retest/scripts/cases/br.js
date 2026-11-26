// Cross-browser + mobile + light a11y check of the Tia panel (CRM). TAG env names the run.
const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const TAG = process.env.TAG || 'x'; const R = { tag: TAG };
await go('/'); await sleep(6000);
R.launcher = await page.locator(L).count();
if (!R.launcher) { await shot(`BR-${TAG}-no-launcher`); return R; }
const lb = await page.locator(L).first().boundingBox(); const vp = page.viewportSize(); R.launcherInView = !!lb && lb.x >= 0 && lb.y >= 0 && lb.x + lb.width <= vp.width && lb.y + lb.height <= vp.height;
await page.locator(L).first().click(); await sleep(2500); R.panel = await page.locator(P).count();
const pb = await page.locator(P).first().boundingBox().catch(() => null); R.panelBox = pb && { x: Math.round(pb.x), y: Math.round(pb.y), w: Math.round(pb.width), h: Math.round(pb.height) }; R.panelFits = !!pb && pb.x >= -1 && pb.x + pb.width <= vp.width + 1;
const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1500); }
const ta = page.locator(`${P} textarea`); R.textarea = await ta.count();
if (R.textarea) {
  const t0 = Date.now(); const n = await page.locator('[data-testid="tia-reply"]').count(); await ta.first().fill('How many leads are there in CRM?'); await ta.first().press('Enter');
  await page.waitForFunction(k => document.querySelectorAll('[data-testid="tia-reply"]').length > k && !document.querySelector('[data-testid="tia-thinking"]'), n, { timeout: 120000 }).catch(() => {}); await sleep(2500);
  R.answer = (await page.locator('[data-testid="tia-reply"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 200); R.answerOk = /11,?870/.test(R.answer); R.ms = Date.now() - t0;
}
await shot(`BR-${TAG}-answer`);
// light a11y: unnamed buttons / inputs in the panel, roles, focus + Esc
R.a11y = await page.evaluate(sel => { const p = document.querySelector(sel); if (!p) return null; const name = e => (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || '').trim();
  const btns = [...p.querySelectorAll('button')]; const unnamed = btns.filter(b => !name(b) && !b.querySelector('[aria-label],title')).map(b => b.outerHTML.slice(0, 120));
  const ta = p.querySelector('textarea'); const taName = ta && (ta.getAttribute('aria-label') || ta.getAttribute('placeholder') || (ta.id && document.querySelector(`label[for="${ta.id}"]`)?.innerText));
  return { buttons: btns.length, unnamed: unnamed.length, unnamedSample: unnamed.slice(0, 3), textareaName: taName || null, role: p.getAttribute('role'), ariaModal: p.getAttribute('aria-modal'), labelled: !!(p.getAttribute('aria-label') || p.getAttribute('aria-labelledby')), live: !!p.querySelector('[aria-live]') }; }, P);
const tabs = []; for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); tabs.push(await page.evaluate(sel => { const a = document.activeElement; return (document.querySelector(sel)?.contains(a) ? 'in:' : 'OUT:') + (a?.getAttribute('aria-label') || a?.tagName || '').slice(0, 25); }, P)); }
R.tabOrder = tabs; R.focusLeaves = tabs.some(t => t.startsWith('OUT'));
await page.locator(`${P} textarea`).first().focus().catch(() => {}); await page.keyboard.press('Escape'); await sleep(1200); R.escCloses = (await page.locator(P).count()) === 0 || !(await page.locator(P).first().isVisible().catch(() => false));
return R;
