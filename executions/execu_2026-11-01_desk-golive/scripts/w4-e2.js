await go('/views/all/tickets/271150d9-49fd-4de1-a7d8-068b14d3927f', 8000); await page.getByText('Mahmoud Mohamed').first().waitFor({ timeout: 40000 }).catch(() => {});
await sleep(3000); await shot('w4/W4-03-arabic-mail');
const at = page.locator('main').last().getByText(/^Attachment/i).first(); await at.click().catch(e => out.e = e.message.slice(0, 60)); await sleep(4000);
out.attTab = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 600);
await shot('w4/W4-03-attachments');
// composer on the Marketing mail ticket
await go('/views/all/tickets/6f9037a0-15b3-4f21-a584-2e21b3b5259e', 8000); await page.getByText('Mahmoud Mohamed').first().waitFor({ timeout: 40000 }).catch(() => {}); await sleep(2000);
await page.getByRole('button', { name: /^Reply All$/ }).first().click().catch(e => out.e2 = e.message.slice(0, 60)); await sleep(4000);
out.composerBtns = await page.locator('button').evaluateAll(bs => bs.filter(b => b.offsetParent).map(b => (b.getAttribute('aria-label') || b.title || b.innerText || '').trim()).filter(Boolean)).then(a => [...new Set(a)].slice(-60));
await shot('w4/W4-25-composer');
return fin({ out });
