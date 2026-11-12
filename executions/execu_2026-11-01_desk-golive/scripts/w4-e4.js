await go('/views/all/tickets/6f9037a0-15b3-4f21-a584-2e21b3b5259e', 8000); await page.getByText('Mahmoud Mohamed').first().waitFor({ timeout: 40000 }).catch(() => {}); await sleep(2000);
await page.getByRole('button', { name: /^Reply All$/ }).first().click(); await sleep(3500);
await page.getByRole('button', { name: 'Insert template' }).click(); await sleep(3000);
const pop = page.locator('[role=dialog]').last();
const row = pop.getByText('QA GL W4 template', { exact: true }).first().locator('xpath=ancestor::*[.//button[normalize-space()="Insert"]][1]');
await row.getByRole('button', { name: 'Insert' }).first().click(); await sleep(3000);
const ed = page.locator('[contenteditable=true]').last(); out.editor = (await ed.innerText()).slice(0, 300); out.leftBraces = /\{\{/.test(out.editor);
await shot('w4/W4-25-english-inserted');
const n0 = NET.length; await page.getByRole('button', { name: /^Send$/ }).click(); await sleep(7000);
out.send = NET.slice(n0).filter(x => /replies/.test(x.u) && x.m === 'POST').map(x => x.s);
const rp = await api('GET', '/desk/tickets/6f9037a0-15b3-4f21-a584-2e21b3b5259e/replies'); out.stored = arr(D(rp.j)).filter(x => x.mode).map(x => String(x.body_html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 160));
// W4-04 plain agent reply on the Customer Support mail ticket
const r = await api('POST', '/desk/tickets/89a1b22a-6eb7-4f30-ad15-8bdfc9f06d23/replies', { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W4 mail 01', body_html: '<p>QA GL W4 agent reply to mail 01 - please reply to this email (W4-05).</p>' });
out.w404 = r.s + ' ' + JSON.stringify(D(r.j) && (D(r.j).reply || D(r.j)).from_address || '').slice(0, 80);
return fin({ out });
