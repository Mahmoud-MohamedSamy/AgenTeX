async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
 await openCreate(mid, lid); return { url: page.url(), html: (await page.locator('[data-rule-field=qa_lr_radio]').first().innerHTML().catch(e=>'NONE '+e.message)).slice(0,1500), n: await page.locator('[data-rule-field]').count(), body: (await bodyText()).slice(0,300) }; }
