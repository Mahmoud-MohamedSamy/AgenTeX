await shot('m6-now'); return done({ url: page.url(), t: (await txt()).split('\n').filter(l => /layout|Layout|QA/.test(l)).slice(0, 30) });
