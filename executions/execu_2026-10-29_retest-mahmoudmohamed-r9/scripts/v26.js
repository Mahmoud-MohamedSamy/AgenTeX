const out = {}; await page.getByText('Activity Reminders', { exact: true }).first().click(); for (let j = 0; j < 40 && !/Reminder card fields|Additional users/i.test(await txt()); j++) await sleep(2000); await sleep(3000);
out.url = page.url(); await shot('v26-reminders-top');
out.boxes = await page.evaluate(() => { const res = []; for (const h of ['Reminder card fields', 'Additional users', 'Additional profiles']) { const lab = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim().toLowerCase().startsWith(h.toLowerCase())); if (!lab) { res.push(h + ': label not found'); continue; }
  let sec = lab.parentElement; for (let k = 0; k < 6 && sec; k++) { const sc = [...sec.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY)); if (sc) { res.push(h + ': scroll box height ' + sc.clientHeight + ' content ' + sc.scrollHeight + ' items ' + sc.querySelectorAll('label,li,[role=option],input[type=checkbox]').length); break; } sec = sec.parentElement; }
  if (!res.find(r => r.startsWith(h))) res.push(h + ': no inner scroll box found'); } return res; });
out.pageHeight = await page.evaluate(() => Math.max(...[...document.querySelectorAll('*')].filter(e => /auto|scroll/.test(getComputedStyle(e).overflowY)).map(e => e.scrollHeight)));
const lab = page.getByText(/^Additional users/i).first(); if (await lab.count()) { await lab.scrollIntoViewIfNeeded(); await sleep(800); await shot('v26-reminders-users'); }
return done(out);
