async (page, frame, ctx) => { const ps = ctx.pages(); return { n: ps.length, urls: ps.map(p => p.url().replace(/\?.*/, '').slice(0, 100)) }; }
