const o = {};
o.fallback = await page.evaluate(() => { const l = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^Fall back to the default status$/.test(e.textContent.trim())); if (!l) return null; let r = l; for (let k = 0; k < 4; k++) { r = r.parentElement; const i = r.querySelector('input'); if (i) return i.checked; } return null; });
const saves = page.locator('button', { hasText: /^Save$/ }); const n = await saves.count(); await saves.nth(n - 1).click().catch(e => o.e = e.message.slice(0, 60));
let t = ''; for (let i = 0; i < 8; i++) { await sleep(800); t = (await txt()).replace(/\s+/g, ' '); if (/saved|Saved|error/i.test(t.slice(-1500))) break; }
o.msg = t.match(/.{0,60}(Statuses saved|saved|Error|error)[^.]{0,80}/)?.[0];
o.shot = await shot('rt/2797-saved');
return JSON.stringify(o);
