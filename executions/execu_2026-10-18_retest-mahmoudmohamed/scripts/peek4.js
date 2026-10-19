await shot('_peek'); return done({ url: page.url(), body: (await txt()).slice(0, 300) });
