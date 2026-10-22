await go('/', 10000); return done({ t: (await txt()).slice(0, 200) });
