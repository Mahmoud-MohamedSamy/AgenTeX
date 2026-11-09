const o = {};
await page.goto(H + '/settings/organization/company', { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); for (let i = 0; i < 30; i++) { await sleep(1000); const t = await txt().catch(() => ''); if (/Primary Information/.test(t)) break; } await sleep(1500);
await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(2500);
o.inputs = await page.$$eval('input, textarea, select', els => els.filter(e => e.offsetParent !== null).map(e => { const l = e.id && document.querySelector('label[for="' + e.id + '"]'); return (l ? l.innerText.trim() : '') + '|' + (e.name || e.id || '') + '|' + e.type + '|' + (e.placeholder || '') + '|' + String(e.value).slice(0, 40); }));
o.buttons = await page.$$eval('button', els => els.filter(e => e.offsetParent !== null).map(e => (e.innerText || e.getAttribute('aria-label') || '').trim()).filter(x => x && x.length < 30).slice(-12));
o.shot = await shot('ndc/W1-B1-edit-form');
await page.keyboard.press('Escape');
return done(o);
