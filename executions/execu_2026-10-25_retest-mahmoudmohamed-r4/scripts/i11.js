const B = '/desk/integrations/crm', T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const p = await api('POST', `${B}/pause`, { reason: 'QA RT retest 2394/2404/2405' }); const st = (await api('GET', `${B}/status`)).j?.data?.paused;
await page.goto(H + `/modules/${T}`, { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 60; k++) { await sleep(1000); if (/Classic View|Tickets/.test(await txt().catch(() => ''))) break; } await sleep(3000);
const pick = page.getByRole('button', { name: /Classic View|Handshake|View/ }).filter({ hasText: /Classic View|Handshake Mode/ }).first();
await pick.click(); await sleep(1200);
const opts = await page.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option],[role=menuitemradio],[data-radix-popper-content-wrapper] *')].filter(e => e.childElementCount === 0).map(e => e.textContent.trim()).filter(Boolean));
await shot('2394-01-picker-paused');
await page.keyboard.press('Escape');
return done({ pause: p.s, paused: st, opts: [...new Set(opts)].slice(0, 25) });
