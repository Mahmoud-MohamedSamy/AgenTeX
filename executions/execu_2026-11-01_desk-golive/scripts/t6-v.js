out.spam = (await api('POST', '/desk/tickets/' + T1 + '/spam', { mark_contact: false })).s;
const sh = await api('GET', '/desk/tickets/' + T1 + '/shares'); out.sharesAfterSpam = sh.s + ' ' + JSON.stringify(D(sh.j)).slice(0, 200);
const c = await api('POST', '/desk/tickets/' + T1 + '/comments', { body_html: '<p>QA GL TM comment on spam ticket</p>' }); out.commentOnSpam = c.s + ' ' + c.t.slice(0, 160);
await go('/views/all/tickets/' + T1, 9000); await page.getByRole('button', { name: /^Reply All/ }).first().click().catch(e => out.rErr = e.message.slice(0, 80)); await sleep(2500);
out.composer = (await page.locator('[contenteditable=true]').count()) + ' editors; send buttons ' + (await page.getByRole('button', { name: /^Send/ }).count());
await shot('tm/tavi-spam-reply'); await page.keyboard.press('Escape');
return fin({ out });
