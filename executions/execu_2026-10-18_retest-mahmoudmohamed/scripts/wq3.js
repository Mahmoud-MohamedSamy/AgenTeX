await go('/workqueue', 20000);
await shot('wq-landing');
return done({ url: page.url(), body: (await txt()).slice(250, 2500) });
