return done({ t: (await txt()).split('Result')[1]?.slice(0, 1200), s: await shot('g6') });
