await page.goto(H + '/views/all/tickets/5c68004d-860c-4bcd-b6b8-77e0bce5c044', { waitUntil: 'domcontentloaded' }); await sleep(9000);
await page.mouse.click(1561, 28); await sleep(2000);
const m = (await text()).replace(/\s+/g, ' '); const i = m.search(/theme|dark|light|مظهر|داكن/i);
await shot('3056-r3-probe-menu.png');
return { around: i >= 0 ? m.slice(Math.max(0, i - 200), i + 200).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '<email>') : 'none', btns: await page.locator('[role=menu] *,[role=menuitem],[role=switch]').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(0, 30)) };
