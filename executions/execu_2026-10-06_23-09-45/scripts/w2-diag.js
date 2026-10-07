await go('/hq', 8000);
const s = await shot('diag-owner');
rec('DIAG', 'INFO', `url ${page.url()}; auth captured=${!!(hdr && hdr.authorization)} (len ${hdr && hdr.authorization ? hdr.authorization.length : 0}); title ${(await txt()).slice(0, 120).replace(/\s+/g, ' ')}`, { shot: s });
return done();
