async (page, ctx) => { const n = ctx.pages().length; await page.close(); return { before: n, after: ctx.pages().length }; }
