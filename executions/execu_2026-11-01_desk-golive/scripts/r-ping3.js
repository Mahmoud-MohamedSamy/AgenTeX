await go('/views/all/tickets', 12000); return done({ url: page.url(), text: (await txt()).replace(/\s+/g, ' ').slice(0, 300), shot: await shot('../wave2n/r-ping-owner') });
