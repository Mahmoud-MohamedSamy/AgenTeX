await go('/settings/organization/customer-happiness', 10000);
const lang = page.locator('main').last().getByText(/^Languages$/).first(); await lang.scrollIntoViewIfNeeded();
const sec = lang.locator('xpath=ancestor::*[.//button[normalize-space()="Download file"]][1]');
out.secHtml = (await sec.innerHTML()).replace(/class="[^"]*"/g, '').replace(/\s+/g, ' ').slice(0, 1500);
await sec.screenshot({ path: SHOT + '/w4/W4-79-section.png' });
return fin({ out });
