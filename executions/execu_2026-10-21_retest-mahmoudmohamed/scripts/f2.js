return done({ head: (await txt()).split('Timeline')[1]?.slice(0, 600), shot: await shot('1311-01b') });
