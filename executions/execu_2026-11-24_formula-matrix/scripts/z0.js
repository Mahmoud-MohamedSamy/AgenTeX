log('url', page.url(), await page.title());
for (const u of ['/crm/v2.2/org', '/crm/v2.2/settings/fields?module=Leads', '/crm/v2.2/settings/modules']) { const r = await zf('GET', u); log(u, r.s, r.t.slice(0, 400)); }
