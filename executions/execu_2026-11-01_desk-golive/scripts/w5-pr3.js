out.err = (await mtxt()).match(/[^.]{0,80}Departments[^.]{0,120}/g);
out.btns = await page.locator('main').last().getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean).slice(-20));
await shot('w5/W5-60-form-error');
return fin({ out });
