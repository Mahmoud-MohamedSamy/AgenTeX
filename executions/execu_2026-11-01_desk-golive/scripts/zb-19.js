await page.getByText('Not Spam', { exact: true }).last().click(); await page.waitForTimeout(4000);
const t = await api(page, 'GET', 'tickets/' + T109); out.isSpam = t.j && t.j.isSpam;
const c = await api(page, 'GET', 'contacts/' + t.j.contactId); out.contactSpam = c.j && c.j.isSpam;
